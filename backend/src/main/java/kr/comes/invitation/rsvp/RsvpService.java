package kr.comes.invitation.rsvp;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * 참석 의사 비즈니스 로직.
 */
@Service
@RequiredArgsConstructor
public class RsvpService {

	private final RsvpMapper rsvpMapper;

	@Transactional
	public Rsvp create(Rsvp rsvp) {
		if (rsvp.getHeadcount() == null || rsvp.getHeadcount() < 1) {
			rsvp.setHeadcount(1);
		}
		rsvpMapper.insert(rsvp);
		return rsvp;
	}

	@Transactional(readOnly = true)
	public List<Rsvp> list() {
		return rsvpMapper.findAll();
	}
}
