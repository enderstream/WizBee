package com.wizbee.backend.chart.repository;

import com.wizbee.backend.chart.dto.ChartResponseDto;
import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChartRepository extends JpaRepository<Chart, Long> {

//    @Query("SELECT c.fullTime, c.date, c.outCount, c.outTime, c.phoneCount, c.phoneTime, c.sleepCount, c.sleepTime, c.studyTime FROM Chart c WHERE c.user = :user AND c.date = :date")
//    Object[] findByDate(@Param("user") User user, @Param("date") LocalDate date);
    @Query("SELECT c FROM Chart c WHERE c.user = :user AND c.date = :date")
    Chart findByDate(@Param("user") User user, @Param("date") LocalDate date);

    @Query("SELECT c.studyTime, c.date FROM Chart c WHERE c.user = :user AND c.date BETWEEN :startDate AND :endDate")
    List<Object[]> findWeekByDate(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


}
