package kr.comes.invitation.config;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 공통 예외 → HTTP 상태 매핑.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	/** 입력값 검증 실패 → 400 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
		String msg = e.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(f -> f.getField() + ": " + f.getDefaultMessage())
			.orElse("입력값이 올바르지 않습니다.");
		return ResponseEntity.badRequest().body(Map.of("message", msg));
	}

	/** 잘못된 요청(없는 리소스 등) → 400 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
		return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
	}

	/** 비밀번호 불일치 등 권한 문제 → 403 */
	@ExceptionHandler(SecurityException.class)
	public ResponseEntity<Map<String, String>> handleForbidden(SecurityException e) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
	}
}
