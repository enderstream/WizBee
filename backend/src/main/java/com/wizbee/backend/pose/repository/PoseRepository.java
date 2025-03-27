package com.wizbee.backend.pose.repository;

import com.wizbee.backend.pose.entity.Pose;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoseRepository extends JpaRepository<Pose, Integer> {

}
