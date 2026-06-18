package kr.comes.invitation.rsvp;

import java.util.List;

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
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

/**
 * 참석 의사 REST API.
 *
 * <ul>
 *   <li>POST /api/rsvp   참석 의사 제출</li>
 *   <li>GET  /api/rsvp   목록(관리자용)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/rsvp")
@RequiredArgsConstructor
public class RsvpController {

	private final RsvpService rsvpService;

	@PostMapping
	public ResponseEntity<Rsvp> create(@Valid @RequestBody CreateRequest req) {
		Rsvp saved = rsvpService.create(Rsvp.builder()
			.side(req.side())
			.name(req.name())
			.attend(req.attend())
			.headcount(req.headcount())
			.meal(Boolean.TRUE.equals(req.meal()))
			.shuttle(Boolean.TRUE.equals(req.shuttle()))
			.memo(req.memo())
			.build());
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@GetMapping
	public List<Rsvp> list() {
		return rsvpService.list();
	}

	public record CreateRequest(
		@NotBlank @Pattern(regexp = "GROOM|BRIDE") String side,
		@NotBlank @Size(max = 50) String name,
		@NotNull Boolean attend,
		Integer headcount,
		Boolean meal,
		Boolean shuttle,
		@Size(max = 500) String memo) {
	}
}
