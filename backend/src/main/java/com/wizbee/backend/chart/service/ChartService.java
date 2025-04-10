package com.wizbee.backend.chart.service;

import com.wizbee.backend.chart.dto.*;
import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.repository.ChartRepository;
import com.wizbee.backend.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ChartService {

    @Autowired
    ChartRepository chartRepository;

    /**
     * 통계 데이터를 저장한다.
     * @param chart 통계 엔티티 객체
     * @return 저장된 Chart 객체
     */


    /**
     * 유저와 날짜를 기준으로 집계된 통계 데이터를 조회한다.
     * @param user 유저 엔티티
     * @param date 조회할 날짜
     * @return ChartAggregateDto (집계된 통계)
     */
    public ChartAggregateDto findByDate(User user, LocalDate date){
        return chartRepository.findAggregatedByDate(user, date);
    }

    /**
     * 해당 유저의 주간 순공 시간 통계를 반환한다.
     * @param user 유저 엔티티
     * @param date 기준 날짜 (오늘)
     * @return 날짜별 순공시간 리스트
     */
    public List<ChartWeekStudyTimeResponseDto> findWeekByDate(User user, LocalDate date){
        LocalDate endDate = date;
        LocalDate startDate = endDate.minusDays(6);
        return chartRepository.findWeekByDate(user, startDate, endDate);
    }

    /**
     * 유저의 전체 평균 공부 시간을 반환한다.
     * @param user 유저 엔티티
     * @return 평균 공부 시간
     */
    public double avgOfUser(User user) {
        Double result = chartRepository.avgOfUser(user);
        return (result != null) ? result : 0.0;
    }

    /**
     * 유저의 또래 평균 공부 시간을 반환한다.
     * @param user 유저 엔티티
     * @return 또래 평균 공부 시간
     */
    public double avgOfUserAge(User user) {
        Date birthday = user.getBirthday();
        Double result = chartRepository.avgOfUserAge(birthday);
        return (result != null) ? result : 0.0;
    }

    /**
     * 유저와 해당 날짜에 대한 비공부 시간 비율을 계산한다.
     * @param user 유저 엔티티
     * @param date 기준 날짜
     * @return 비공부 시간 비율 (0.0~1.0)
     */
    public ResponseEntity<?> getChartScore(User user, LocalDate date) {
        try {
            ChartAggregateDto oneDayChart = findByDate(user, date);
            if(oneDayChart == null){
                return ResponseEntity.noContent().build();
            }
            int fullStudyTime = oneDayChart.getFullTime();
            int notStudyTime = oneDayChart.getSleepTime() + oneDayChart.getPhoneTime() + oneDayChart.getOutTime();

            if (fullStudyTime == 0) {
//                return ResponseEntity.badRequest().body("공부 기록이 없습니다.");
                return ResponseEntity.noContent().build();
            }

            double result = (double) notStudyTime / fullStudyTime;
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * 유저 ID로 또래 평균 통계 데이터를 반환한다.
     * @param userId 유저 ID
     * @return PeerStatisticsResponseDto
     */
    public PeerStatisticsResponseDto getPeerStats(Integer userId) {
        Object result = chartRepository.getPeerStatistics(userId);
        if (result == null) {
            return new PeerStatisticsResponseDto(); // 방어적 처리
        }

        Object[] arr = (Object[]) result;
        PeerStatisticsResponseDto dto = new PeerStatisticsResponseDto();
        dto.setAvgFullTime(toFloat(arr[0]));
        dto.setAvgStudyTime(toFloat(arr[1]));
        dto.setAvgOutTime(toFloat(arr[2]));
        dto.setAvgOutCnt(toFloat(arr[3]));
        dto.setAvgPhoneTime(toFloat(arr[4]));
        dto.setAvgPhoneCnt(toFloat(arr[5]));
        dto.setAvgSleepTime(toFloat(arr[6]));
        dto.setAvgSleepCnt(toFloat(arr[7]));

        return dto;
    }

    /**
     * 유저 ID에 해당하는 개인 평균 통계 데이터를 반환한다.
     * @param userId 유저 ID
     * @return UserStatisticsResponseDto
     */
    public UserStatisticsResponseDto getUserStats(Integer userId) {
        Object result = chartRepository.getUserStatistics(userId);
        if (result == null) {
            return new UserStatisticsResponseDto(); // 방어 코드 (거의 안 들어오지만)
        }

        Object[] arr = (Object[]) result;
        UserStatisticsResponseDto dto = new UserStatisticsResponseDto();
        dto.setAvgFullTime(toFloat(arr[0]));
        dto.setAvgStudyTime(toFloat(arr[1]));
        dto.setAvgOutTime(toFloat(arr[2]));
        dto.setAvgOutCnt(toFloat(arr[3]));
        dto.setAvgPhoneTime(toFloat(arr[4]));
        dto.setAvgPhoneCnt(toFloat(arr[5]));
        dto.setAvgSleepTime(toFloat(arr[6]));
        dto.setAvgSleepCnt(toFloat(arr[7]));

        return dto;
    }

    private float toFloat(Object obj) {
        return (obj != null) ? ((BigDecimal) obj).floatValue() : 0.0f;
    }


    /**
     * 라즈베리파이로부터 수신한 통계 요청을 처리하여 저장한다.
     * @param requestDto 요청 데이터 DTO
     * @param user 유저 객체
     * @return 저장 성공/실패 응답
     */
    public ResponseEntity<?> processChartRequest(ChartRequestDto requestDto, User user) {
        if (user == null) {
            return ResponseEntity.badRequest().body("유효하지 않은 라즈베리파이 ID입니다.");
        }

        Chart chart = new Chart();
        chart.setUser(user);
        chart.setDate(Date.valueOf(requestDto.getDate()));
        chart.setFullTime(requestDto.getFullTime());
        chart.setPhoneTime(requestDto.getPhoneTime());
        chart.setPhoneCount(requestDto.getPhoneCount());
        chart.setSleepTime(requestDto.getSleepTime());
        chart.setSleepCount(requestDto.getSleepCount());
        chart.setOutTime(requestDto.getOutTime());
        chart.setOutCount(requestDto.getOutCount());

        chart.setStudyTime(chart.getFullTime() - (chart.getOutTime() + chart.getPhoneTime() + chart.getSleepTime()));

        Chart savedChart = chartRepository.save(chart);
        if (savedChart != null) {
            return ResponseEntity.ok("통계 등록에 성공했습니다.");
        } else {
            return ResponseEntity.badRequest().body("저장 실패.");
        }
    }

    /**
     * 날짜 문자열을 LocalDate로 변환한다.
     * @param dateStr yyyy-MM-dd 형식 문자열
     * @return 변환된 LocalDate 또는 null
     */
    public LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            return null;
        }
    }
}