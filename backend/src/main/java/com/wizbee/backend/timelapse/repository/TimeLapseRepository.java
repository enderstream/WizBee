package com.wizbee.backend.timelapse.repository;

import com.wizbee.backend.timelapse.entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimeLapseRepository extends JpaRepository<TimeLapse, Integer> {
    @Query("SELECT new com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto(t.id, t.user.id, t.url, t.title, t.date) " +
            "FROM TimeLapse t " +
            "WHERE t.user.id = :userId")
    List<TimeLapseGetRequestDto> findAllByUserId(@Param("userId") Integer userId);
}
