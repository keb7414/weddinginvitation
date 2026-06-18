package kr.comes.invitation.guestbook;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

/**
 * 방명록 REST API.
 *
 * <ul>
 *   <li>POST   /api/guestbook        작성</li>
 *   <li>GET    /api/guestbook        목록</li>
 *   <li>DELETE /api/guestbook/{id}   삭제(비밀번호 필요)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

	private final GuestbookService guestbookService;

	@PostMapping
	public ResponseEntity<Guestbook> create(@RequestBody CreateRequest req) {
		Guestbook created = guestbookService.create(req.name(), req.message(), req.password());
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping
	public List<Guestbook> list() {
		return guestbookService.list();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id, @RequestBody DeleteRequest req) {
		guestbookService.delete(id, req.password());
		return ResponseEntity.noContent().build();
	}

	public record CreateRequest(
		@NotBlank @Size(max = 50) String name,
		@NotBlank @Size(max = 1000) String message,
		@NotBlank @Size(max = 30) String password) {
	}

	public record DeleteRequest(@NotBlank String password) {
	}
}
