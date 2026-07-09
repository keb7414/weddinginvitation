-- ============================================================
-- 방문 이력 추가: 최근 방문 시각(last_seen) + 방문 횟수(visit_count)
--   기존: 기기당 1행, created_at(최초 방문)만 기록 → 재방문 흔적 없음
--   변경: 재방문 시 last_seen 갱신 + visit_count 증가
--   실행: Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN
-- ============================================================

-- 1) 컬럼 추가 + 기존 행 백필(최초 방문 기준)
alter table public.visit add column if not exists last_seen   timestamptz;
alter table public.visit add column if not exists visit_count integer;

update public.visit
   set last_seen   = coalesce(last_seen, created_at),
       visit_count = coalesce(visit_count, 1);

alter table public.visit alter column last_seen   set default now();
alter table public.visit alter column last_seen   set not null;
alter table public.visit alter column visit_count set default 1;
alter table public.visit alter column visit_count set not null;

-- 2) 기록 함수 — 최초 방문은 INSERT, 재방문은 last_seen/횟수 갱신
--    SECURITY DEFINER 로 실행해 anon 에게 UPDATE 권한을 직접 주지 않는다.
create or replace function public.visit_track(
  p_visitor_id text,
  p_user_agent text default null,
  p_referrer   text default null,
  p_path       text default null,
  p_language   text default null
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.visit as v (visitor_id, user_agent, referrer, path, language)
  values (p_visitor_id, p_user_agent, p_referrer, p_path, p_language)
  on conflict (visitor_id) do update
    set last_seen   = now(),
        visit_count = v.visit_count + 1,
        user_agent  = coalesce(excluded.user_agent, v.user_agent),
        path        = coalesce(excluded.path, v.path);
$$;

grant execute on function public.visit_track(text, text, text, text, text) to anon;

-- 3) 최근 접속 기록 — last_seen / visit_count 포함 (반환타입 변경이라 DROP 후 재생성)
drop function if exists public.visit_recent(int);

create function public.visit_recent(p_limit int default 100)
returns table (
  visitor_id  text,
  user_agent  text,
  referrer    text,
  path        text,
  created_at  timestamptz,
  last_seen   timestamptz,
  visit_count integer
)
language sql
security definer
set search_path = public
as $$
  select visitor_id, user_agent, referrer, path, created_at, last_seen, visit_count
    from public.visit
   order by last_seen desc
   limit p_limit
$$;

grant execute on function public.visit_recent(int) to anon;
