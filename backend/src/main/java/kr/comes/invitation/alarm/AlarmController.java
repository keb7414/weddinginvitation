package kr.comes.invitation.alarm;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

/**
 * 예식 알림 신청 REST API.
 *
 * <ul>
 *   <li>POST /api/alarm   알림 신청</li>
 *   <li>GET  /api/alarm   목록(관리자용)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/alarm")
@RequiredArgsConstructor
public class AlarmController {

	private final AlarmService alarmService;

	@PostMapping
	public ResponseEntity<Alarm> create(@Valid @RequestBody CreateRequest req) {
		Alarm saved = alarmService.create(Alarm.builder()
			.contact(req.contact())
			.notifyAt(req.notifyAt())
			.build());
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@GetMapping
	public List<Alarm> list() {
		return alarmService.list();
	}

	public record CreateRequest(
		@NotBlank @Size(max = 100) String contact,
		@NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime notifyAt) {
	}
}
