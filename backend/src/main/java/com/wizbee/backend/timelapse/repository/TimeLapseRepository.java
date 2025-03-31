package com.wizbee.backend.timelapse.repository;

import com.wizbee.backend.timelapse.Entity.TimeLapse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimeLapseRepository extends JpaRepository<TimeLapse, Integer> {

}
