package com.wizbee.backend.pose.repository;

import com.wizbee.backend.pose.entity.PoseImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoseImageRepository extends JpaRepository<PoseImage, Integer> {
}
