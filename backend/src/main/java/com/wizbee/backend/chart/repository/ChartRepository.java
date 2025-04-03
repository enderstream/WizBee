package com.wizbee.backend.chart.repository;

import com.wizbee.backend.chart.dto.ChartAggregateDto;
import com.wizbee.backend.chart.dto.ChartResponseDto;
import com.wizbee.backend.chart.dto.ChartWeekStudyTimeResponseDto;
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

    // 유저 개인의 평균 순공시간
    @Query("SELECT AVG(c.studyTime) FROM Chart c WHERE c.user = :user")
    Double avgOfUser(@Param("user") User user);
    
    // 유저 또래 평균 순공시간
    @Query("SELECT AVG(c.studyTime) " +
            "FROM Chart c " +
            "JOIN c.user u " +
            "WHERE YEAR(u.birthday) = YEAR(:birthday)")
    Double avgOfUserAge(@Param("birthday") java.sql.Date birthday);



//    @Query("SELECT c.fullTime, c.date, c.outCount, c.outTime, c.phoneCount, c.phoneTime, c.sleepCount, c.sleepTime, c.studyTime FROM Chart c WHERE c.user = :user AND c.date = :date")
//    Object[] findByDate(@Param("user") User user, @Param("date") LocalDate date);
    @Query("""
    SELECT new com.wizbee.backend.chart.dto.ChartAggregateDto(
        SUM(c.fullTime), SUM(c.studyTime), SUM(c.sleepTime),
        SUM(c.phoneTime), SUM(c.outTime), SUM(c.sleepCount),
        SUM(c.phoneCount), SUM(c.outCount), c.date, c.user
    )
    FROM Chart c
    WHERE c.user = :user AND c.date = :date
    GROUP BY c.date, c.user
    """)
    ChartAggregateDto findAggregatedByDate(@Param("user") User user, @Param("date") LocalDate date);

    @Query("""
    SELECT new com.wizbee.backend.chart.dto.ChartWeekStudyTimeResponseDto(
        SUM(c.studyTime), c.date
    )
    FROM Chart c
    WHERE c.user = :user AND c.date BETWEEN :startDate AND :endDate
    GROUP BY c.date
    ORDER BY c.date DESC
""")
    List<ChartWeekStudyTimeResponseDto> findWeekByDate(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);


    @Query(value = "SELECT " +
            "avg(c.chart_fulltime) as avgFullTime, " +
            "avg(c.chart_studytime) as avgStudyTime, " +
            "avg(c.chart_outtime) as avgOutTime, " +
            "sum(c.chart_outcnt) / sum(c.chart_fulltime) * 60 as avgOutCnt, " +
            "avg(c.chart_phonetime) as avgPhoneTime, " +
            "sum(c.chart_phonecnt) / sum(c.chart_fulltime) * 60 as avgPhoneCnt, " +
            "avg(c.chart_sleeptime) as avgSleepTime, " +
            "sum(c.chart_sleepcnt) / sum(c.chart_fulltime) * 60 as avgSleepCnt " +
            "FROM chart c " +
            "LEFT JOIN users u ON c.user_id = u.user_id " +
            "WHERE year(u.user_birthday) = (SELECT year(s.user_birthday) FROM users s WHERE s.user_id = :userId)",
            nativeQuery = true)
    Object getPeerStatistics(@Param("userId") int userId);

    @Query(value = "SELECT " +
            "avg(c.chart_fulltime) as avgFullTime, " +
            "avg(c.chart_studytime) as avgStudyTime, " +
            "avg(c.chart_outtime) as avgOutTime, " +
            "sum(c.chart_outcnt) / sum(c.chart_fulltime) * 60 as avgOutCnt, " +
            "avg(c.chart_phonetime) as avgPhoneTime, " +
            "sum(c.chart_phonecnt) / sum(c.chart_fulltime) * 60 as avgPhoneCnt, " +
            "avg(c.chart_sleeptime) as avgSleepTime, " +
            "sum(c.chart_sleepcnt) / sum(c.chart_fulltime) * 60 as avgSleepCnt " +
            "FROM chart c " +
            "LEFT JOIN users u ON c.user_id = u.user_id " +
            "WHERE c.user_id = :userId",
            nativeQuery = true)
    Object getUserStatistics(@Param("userId") int userId);
}
