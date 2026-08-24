-- ============================================================
-- 방명록 삭제(대시보드) 버그 수정
--   증상: delete_guestbook 실행 시 42883 "function crypt(text, text) does not exist"
--   원인: 함수 안에서 pgcrypto의 crypt 를 못 찾음(스키마 해석 실패)
--   조치: pgcrypto 를 extensions 스키마에 보장 + crypt 를 extensions.crypt 로 명시
--   실행: Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN
-- ============================================================

-- pgcrypto 가 없으면 extensions 스키마에 설치(있으면 그대로 둠)
create extension if not exists pgcrypto with schema extensions;

-- 삭제 함수 재정의 — crypt 를 스키마 명시(extensions.crypt)해서 항상 찾도록
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
     and password = extensions.crypt(p_password, password);
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

grant execute on function public.delete_guestbook(bigint, text) to anon;

-- (선택) 작성 트리거도 동일하게 스키마 명시해 장래 안정성 확보
create or replace function public.hash_guestbook_password()
returns trigger
language plpgsql
set search_path = public, extensions
as $$
begin
  new.password := extensions.crypt(new.password, extensions.gen_salt('bf'));
  new.is_deleted := false;
  new.created_at := now();
  return new;
end;
$$;

-- ---- 연결 테스트로 넣은 임시 행 정리 ----
delete from public.rsvp      where name = '__TEST__';
delete from public.guestbook where name = '__TEST__';
delete from public.likes     where visitor_id = '__TEST__';
