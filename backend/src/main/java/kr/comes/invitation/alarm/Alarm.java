package kr.comes.invitation.alarm;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ALARM 테이블 도메인 — 예식 알림 신청 한 건.
 *
 * <p>SQL 은 {@code mappers/alarm/AlarmMapper.xml} 에 정의.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alarm {
	private Long id;
	private String contact;        // 연락처(전화/이메일 등)
	private LocalDateTime notifyAt; // 알림 발송 예정 시점
	private Boolean isSent;        // 발송여부
	private LocalDateTime createdAt;
}
