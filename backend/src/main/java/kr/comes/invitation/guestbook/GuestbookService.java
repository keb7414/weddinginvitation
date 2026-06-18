package kr.comes.invitation.guestbook;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * 방명록 비즈니스 로직.
 *
 * <p>비밀번호는 본인 삭제 검증용으로 단순 비교한다(평문 저장). 운영 강화 시
 * 해시(BCrypt) 적용 권장 — TODO. 목록 반환 시 password 는 노출하지 않는다.
 */
@Service
@RequiredArgsConstructor
public class GuestbookService {

	private final GuestbookMapper guestbookMapper;

	@Transactional
	public Guestbook create(String name, String message, String password) {
		Guestbook entry = Guestbook.builder()
			.name(name)
			.message(message)
			.password(password)
			.build();
		guestbookMapper.insert(entry);
		entry.setPassword(null);   // 응답에 비밀번호 노출 금지
		return entry;
	}

	@Transactional(readOnly = true)
	public List<Guestbook> list() {
		return guestbookMapper.findAll();
	}

	/**
	 * 비밀번호 검증 후 소프트 삭제.
	 *
	 * @throws IllegalArgumentException 글이 없거나 이미 삭제된 경우
	 * @throws SecurityException        비밀번호 불일치
	 */
	@Transactional
	public void delete(Long id, String password) {
		Guestbook entry = guestbookMapper.findById(id);
		if (entry == null || Boolean.TRUE.equals(entry.getIsDeleted())) {
			throw new IllegalArgumentException("존재하지 않는 방명록입니다.");
		}
		if (!entry.getPassword().equals(password)) {
			throw new SecurityException("비밀번호가 일치하지 않습니다.");
		}
		guestbookMapper.softDelete(id);
	}
}
