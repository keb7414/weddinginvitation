package kr.comes.invitation.guestbook;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * GUESTBOOK 테이블 도메인 — 방명록 한 건.
 *
 * <p>SQL 은 {@code mappers/guestbook/GuestbookMapper.xml} 에 정의.
 * password 는 본인 삭제용이며 목록 응답에는 노출하지 않는다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Guestbook {
	private Long id;
	private String name;        // 작성자 이름
	private String message;     // 축하 메시지
	private String password;    // 삭제용 비밀번호 (응답 제외)
	private Boolean isDeleted;  // 삭제여부
	private LocalDateTime createdAt;
}
