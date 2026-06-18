package kr.comes.invitation.rsvp;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RSVP 테이블 도메인 — 참석 의사 한 건.
 *
 * <p>SQL 은 {@code mappers/rsvp/RsvpMapper.xml} 에 정의.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rsvp {
	private Long id;
	private String side;        // GROOM(신랑측) | BRIDE(신부측)
	private String name;        // 참석자 대표 이름
	private Boolean attend;     // 참석여부
	private Integer headcount;  // 동반 인원(본인 포함)
	private Boolean meal;       // 식사여부
	private Boolean shuttle;    // 셔틀버스 이용
	private String memo;        // 추가 전달사항
	private LocalDateTime createdAt;
}
