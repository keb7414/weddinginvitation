package kr.comes.invitation.alarm;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * 예식 알림 신청 비즈니스 로직. (실제 발송은 별도 스케줄러에서 notify_at 도래분을 처리)
 */
@Service
@RequiredArgsConstructor
public class AlarmService {

	private final AlarmMapper alarmMapper;

	@Transactional
	public Alarm create(Alarm alarm) {
		alarmMapper.insert(alarm);
		return alarm;
	}

	@Transactional(readOnly = true)
	public List<Alarm> list() {
		return alarmMapper.findAll();
	}
}
