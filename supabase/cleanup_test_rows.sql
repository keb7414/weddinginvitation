-- 검증용으로 들어간 테스트 행 정리 (실제 카운트를 깨끗하게)
delete from public.visit
  where visitor_id like 'VERIFY-%'
     or visitor_id like 'FRESH-%'
     or visitor_id like 'TEST-%';

delete from public.likes
  where visitor_id like 'VERIFY-%'
     or visitor_id like 'FRESH-%'
     or visitor_id like 'TEST-%';
