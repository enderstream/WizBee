package com.wizbee.backend.timelapse.repository;

import com.wizbee.backend.timelapse.Entity.TimeLapse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeLapseRepository extends JpaRepository<TimeLapse, Integer> {
}
