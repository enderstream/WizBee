package com.wizbee.backend.pose.repository;

import com.wizbee.backend.pose.dto.PoseUrlsDto;
import com.wizbee.backend.pose.entity.PoseImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface PoseImageRepository extends JpaRepository<PoseImage, Integer> {
    @Query("SELECT new com.wizbee.backend.pose.dto.PoseUrlsDto(pi.id, pi.imageUrl) "+
            "FROM PoseImage pi " +
            "WHERE pi.user.id = :userId " +
            "AND pi.pose.date = :poseDate")
    List<PoseUrlsDto> findPoseImageUrls(@Param("userId") int userId, @Param("poseDate") Date poseDate);
}
