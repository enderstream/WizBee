package com.wizbee.backend.pose.repository;

import com.wizbee.backend.pose.dto.PoseScoreResponseDto;
import com.wizbee.backend.pose.entity.Pose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface PoseRepository extends JpaRepository<Pose, Integer> {
    @Query("SELECT new com.wizbee.backend.pose.dto.PoseScoreResponseDto(p.user.id, p.date, SUM(p.turtleCnt), SUM(p.shoulderCnt), SUM(p.downCnt)) " +
            "FROM Pose p " +
            "WHERE p.user.id = :userId " +
            "AND p.date = :poseDate " +
            "GROUP BY p.date, p.user.id")
    Optional<PoseScoreResponseDto> findPoseScore(@Param("userId") int userId, @Param("poseDate")Date poseDate);
}
