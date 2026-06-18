-- =====================================================================
--  모바일 청첩장 — Supabase(Postgres) 스키마 + 보안 정책
--  Supabase 콘솔 → SQL Editor 에 그대로 붙여넣어 실행하세요.
--
--  설계 원칙 (정적 호스팅 + 브라우저가 anon 키로 직접 호출):
--   - 모든 테이블 RLS 활성화. anon 에게는 "필요한 동작만" 허용.
--   - 방명록 비밀번호는 평문 저장 금지 → 트리거로 bcrypt 해시.
--     비밀번호 검증/삭제는 브라우저가 아닌 DB 함수(RPC)에서 처리.
--   - 방명록 목록은 password 를 제외한 공개 뷰(guestbook_public)로만 노출.
--   - rsvp/alarm 은 작성(INSERT)만 허용, 조회는 관리자(service_role)만.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1) 방명록
-- ---------------------------------------------------------------------
create table if not exists public.guestbook (
  id          bigint generated always as identity primary key,
  name        text    not null check (char_length(name) between 1 and 50),
  message     text    not null check (char_length(message) between 1 and 1000),
  password    text    not null,                      -- 트리거로 해시되어 저장
  is_deleted  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 작성 시 비밀번호 bcrypt 해시
create or replace function public.hash_guestbook_password()
returns trigger
language plpgsql
as $$
begin
  new.password := crypt(new.password, gen_salt('bf'));
  -- anon 이 임의로 조작하지 못하도록 강제
  new.is_deleted := false;
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists trg_hash_guestbook on public.guestbook;
create trigger trg_hash_guestbook
  before insert on public.guestbook
  for each row execute function public.hash_guestbook_password();

alter table public.guestbook enable row level security;

-- anon: 작성만 허용 (조회/수정/삭제 정책 없음 → 차단)
drop policy if exists gb_insert_anon on public.guestbook;
create policy gb_insert_anon on public.guestbook
  for insert to anon with check (true);

grant insert on public.guestbook to anon;

-- 공개 목록 뷰 (password 제외, 미삭제만). 뷰 소유자 권한으로 base RLS 우회.
create or replace view public.guestbook_public as
  select id, name, message, created_at
    from public.guestbook
   where is_deleted = false
   order by id desc;

grant select on public.guestbook_public to anon;

-- 비밀번호 검증 후 소프트 삭제 (SECURITY DEFINER — 비교는 DB 안에서만)
create or replace function public.delete_guestbook(p_id bigint, p_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.guestbook
     set is_deleted = true
   where id = p_id
     and is_deleted = false
     and password = crypt(p_password, password);
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

grant execute on function public.delete_guestbook(bigint, text) to anon;

-- ---------------------------------------------------------------------
-- 2) 참석 의사 (RSVP)
-- ---------------------------------------------------------------------
create table if not exists public.rsvp (
  id          bigint generated always as identity primary key,
  side        text    not null check (side in ('GROOM','BRIDE')),
  name        text    not null check (char_length(name) between 1 and 50),
  attend      boolean not null,
  headcount   integer not null default 1 check (headcount >= 1),
  meal        boolean not null default false,
  shuttle     boolean not null default false,
  memo        text    check (memo is null or char_length(memo) <= 500),
  created_at  timestamptz not null default now()
);

alter table public.rsvp enable row level security;

drop policy if exists rsvp_insert_anon on public.rsvp;
create policy rsvp_insert_anon on public.rsvp
  for insert to anon with check (true);

grant insert on public.rsvp to anon;
-- 조회 정책 없음 → anon 조회 불가. 관리자는 service_role 로 조회.

-- ---------------------------------------------------------------------
-- 3) 예식 알림 신청 (저장만 — 발송 스케줄러 없음)
-- ---------------------------------------------------------------------
create table if not exists public.alarm (
  id          bigint generated always as identity primary key,
  contact     text    not null check (char_length(contact) between 1 and 100),
  notify_at   timestamptz not null,
  is_sent     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.alarm enable row level security;

drop policy if exists alarm_insert_anon on public.alarm;
create policy alarm_insert_anon on public.alarm
  for insert to anon with check (true);

grant insert on public.alarm to anon;
