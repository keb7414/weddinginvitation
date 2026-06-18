package kr.comes.invitation.rsvp;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

/**
 * RSVP 테이블 MyBatis 매퍼. SQL 은 {@code mappers/rsvp/RsvpMapper.xml}.
 */
@Mapper
public interface RsvpMapper {

	/** 참석 의사 저장 (생성 PK 는 id 에 채워짐). */
	void insert(Rsvp rsvp);

	/** 전체 목록 (최신순) — 관리자용. */
	List<Rsvp> findAll();
}
