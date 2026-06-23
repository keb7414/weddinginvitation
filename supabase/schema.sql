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
set search_path = public, extensions
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

-- 관리자 대시보드(/dashboard)에서 조회하기 위한 SELECT 정책.
-- ⚠️ publishable 키로 조회 가능해지므로, 진짜 비공개가 필요하면 RPC+비밀번호 방식으로 교체할 것.
drop policy if exists rsvp_select_anon on public.rsvp;
create policy rsvp_select_anon on public.rsvp
  for select to anon using (true);

grant select on public.rsvp to anon;

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

-- ---------------------------------------------------------------------
-- 4) 방문자 (같은 기기는 1회만 — visitor_id 를 PK 로 중복 차단)
--    접속정보(브라우저/유입경로/경로/언어/시각) 저장.
-- ---------------------------------------------------------------------
create table if not exists public.visit (
  visitor_id text primary key,           -- 브라우저 localStorage 의 영구 ID
  created_at timestamptz not null default now()
);
-- 기존에 단순 테이블이 이미 있어도 접속정보 컬럼을 안전하게 추가
alter table public.visit add column if not exists user_agent text;
alter table public.visit add column if not exists referrer   text;
alter table public.visit add column if not exists path       text;
alter table public.visit add column if not exists language   text;

alter table public.visit enable row level security;

-- anon: 기록(INSERT)만 허용. 같은 visitor_id 는 ON CONFLICT DO NOTHING 으로 무시됨.
drop policy if exists visit_insert_anon on public.visit;
create policy visit_insert_anon on public.visit
  for insert to anon with check (true);

grant insert on public.visit to anon;

-- 합계 (대시보드 카운트)
create or replace function public.visit_count()
returns integer
language sql
security definer
set search_path = public
as $$ select count(*)::int from public.visit $$;

grant execute on function public.visit_count() to anon;

-- 최근 접속 기록 (대시보드 목록용 — 목록 직접 SELECT 는 막고 RPC 로만 노출)
create or replace function public.visit_recent(p_limit int default 100)
returns table (
  visitor_id text,
  user_agent text,
  referrer   text,
  path       text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select visitor_id, user_agent, referrer, path, created_at
    from public.visit
   order by created_at desc
   limit p_limit
$$;

grant execute on function public.visit_recent(int) to anon;

-- ---------------------------------------------------------------------
-- 5) 좋아요 (하트 버튼 — 누를 때마다 1행 누적)
-- ---------------------------------------------------------------------
create table if not exists public.likes (
  id         bigint generated always as identity primary key,
  visitor_id text,
  created_at timestamptz not null default now()
);

alter table public.likes enable row level security;

drop policy if exists likes_insert_anon on public.likes;
create policy likes_insert_anon on public.likes
  for insert to anon with check (true);

grant insert on public.likes to anon;

-- 합계 (좋아요 수)
create or replace function public.like_count()
returns integer
language sql
security definer
set search_path = public
as $$ select count(*)::int from public.likes $$;

grant execute on function public.like_count() to anon;
