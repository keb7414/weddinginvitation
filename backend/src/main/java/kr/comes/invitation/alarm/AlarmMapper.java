package kr.comes.invitation.alarm;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

/**
 * ALARM 테이블 MyBatis 매퍼. SQL 은 {@code mappers/alarm/AlarmMapper.xml}.
 */
@Mapper
public interface AlarmMapper {

	/** 알림 신청 저장 (생성 PK 는 id 에 채워짐). */
	void insert(Alarm alarm);

	/** 전체 목록 (최신순) — 관리자용. */
	List<Alarm> findAll();
}
