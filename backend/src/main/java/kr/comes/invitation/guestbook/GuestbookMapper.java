package kr.comes.invitation.guestbook;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * GUESTBOOK 테이블 MyBatis 매퍼. SQL 은 {@code mappers/guestbook/GuestbookMapper.xml}.
 */
@Mapper
public interface GuestbookMapper {

	/** 작성 (생성 PK 는 id 에 채워짐). */
	void insert(Guestbook guestbook);

	/** 삭제되지 않은 목록 (최신순, password 제외). */
	List<Guestbook> findAll();

	/** 단건 조회 (삭제 검증용 — password 포함). */
	Guestbook findById(@Param("id") Long id);

	/** 소프트 삭제. */
	int softDelete(@Param("id") Long id);
}
