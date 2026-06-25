-- ============================================================
-- 방문자(visit) · 좋아요(likes) 익명 INSERT 허용 RLS 정책
--   증상: 집계가 안 쌓임 (42501: row violates RLS policy)
--   원인: 두 테이블을 나중에 추가하면서 이 정책이 라이브 DB에 적용 안 됨
--   조치: Supabase 대시보드 → SQL Editor 에 아래 전체를 붙여넣고 RUN
-- ============================================================

-- 방문자
alter table public.visit enable row level security;
drop policy if exists visit_insert_anon on public.visit;
create policy visit_insert_anon on public.visit
  for insert to anon with check (true);
grant insert on public.visit to anon;

-- 좋아요
alter table public.likes enable row level security;
drop policy if exists likes_insert_anon on public.likes;
create policy likes_insert_anon on public.likes
  for insert to anon with check (true);
grant insert on public.likes to anon;
