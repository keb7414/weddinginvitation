-- =====================================================================
--  모바일 청첩장 DB 스키마 (MariaDB)
--  대상 데이터베이스: invitation
--  문자셋: utf8mb4 (이모지/한글 안전)
--  작성일: 2026-06-18
-- =====================================================================

CREATE DATABASE IF NOT EXISTS invitation
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE invitation;

-- ---------------------------------------------------------------------
-- 1) 방명록 (guestbook)
--    - 비밀번호 기반 본인 삭제, 관리자(신랑/신부) 열람
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guestbook (
  id           BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
  name         VARCHAR(50)  NOT NULL                COMMENT '작성자 이름',
  message      VARCHAR(1000) NOT NULL               COMMENT '축하 메시지',
  password     VARCHAR(255) NOT NULL                COMMENT '삭제용 비밀번호(해시 저장 권장)',
  is_deleted   TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '삭제여부(0:정상,1:삭제)',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  PRIMARY KEY (id),
  KEY idx_guestbook_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='방명록';

-- ---------------------------------------------------------------------
-- 2) 참석 의사 (rsvp)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rsvp (
  id           BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
  side         VARCHAR(10)  NOT NULL                COMMENT '구분(GROOM:신랑측, BRIDE:신부측)',
  name         VARCHAR(50)  NOT NULL                COMMENT '참석자 대표 이름',
  attend       TINYINT(1)   NOT NULL                COMMENT '참석여부(1:참석,0:미참석)',
  headcount    INT          NOT NULL DEFAULT 1      COMMENT '동반 인원 수(본인 포함)',
  meal         TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '식사여부(1:예,0:아니오)',
  shuttle      TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '셔틀버스 이용(1:예,0:아니오)',
  memo         VARCHAR(500) NULL                    COMMENT '추가 전달사항',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '제출일시',
  PRIMARY KEY (id),
  KEY idx_rsvp_side (side),
  KEY idx_rsvp_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='참석 의사 전달';

-- ---------------------------------------------------------------------
-- 3) 예식 알림 신청 (alarm)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alarm (
  id           BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
  contact      VARCHAR(100) NOT NULL                COMMENT '연락처(전화/이메일 등)',
  notify_at    DATETIME     NOT NULL                COMMENT '알림 발송 예정 시점',
  is_sent      TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '발송여부(0:대기,1:발송완료)',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '신청일시',
  PRIMARY KEY (id),
  KEY idx_alarm_notify_at (notify_at, is_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='예식 알림 신청';
