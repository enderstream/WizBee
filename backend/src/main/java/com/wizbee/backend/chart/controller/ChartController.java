package com.wizbee.backend.chart.controller;

import com.wizbee.backend.chart.dto.*;
import com.wizbee.backend.chart.service.ChartService;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/study")
public class ChartController {

    @Autowired
    private ChartService chartService;

    @Autowired
    private UserService userService;

    /**
     * 라즈베리파이로부터 통계 데이터를 받아 처리하고 저장한다.
     * @param chartRequestDto 라즈베리파이 통계 DTO
     * @return 저장 성공/실패 메시지
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveChart(@RequestBody ChartRequestDto chartRequestDto) {
        User user = userService.findByMachine(chartRequestDto.getRassId());
        return chartService.processChartRequest(chartRequestDto, user);
    }

    /**
     * 특정 유저의 오늘 날짜 통계를 조회한다.
     * @param date yyyy-MM-dd 형식의 날짜 문자열
     * @param userId 유저 ID
     * @return 통계 데이터 또는 오류 메시지
     */
    @GetMapping("/chart/today/{userId}")
    public ResponseEntity<?> printTodayChart(@RequestParam String date, @PathVariable("userId") int userId){
        User user = userService.findById(userId);
        if(user == null) return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");

        LocalDate localDate = chartService.parseDate(date);
        if(localDate == null) return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다. (yyyy-MM-dd)");

        ChartAggregateDto oneDayChart = chartService.findByDate(user, localDate);
        return (oneDayChart != null) ? ResponseEntity.ok(oneDayChart) : ResponseEntity.noContent().build();
    }

    /**
     * 유저의 개인 평균과 또래 평균 공부 시간을 조회한다.
     * @param userId 유저 ID
     * @return 평균 통계 DTO
     */
    @GetMapping("/chart/mainpage/{userId}")
    public ResponseEntity<?> getCharAvgMainPage(@PathVariable("userId") int userId){
        User user = userService.findById(userId);
        if(user == null) return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");

        double userAvg = chartService.avgOfUser(user);
        double userYearAvg = chartService.avgOfUserAge(user);

        if(userAvg == 0.0){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(new ChartAvgResponseDto(userAvg, userYearAvg));
    }

    /**
     * 유저의 하루 통계에 기반한 딴짓 비율 계산 결과를 반환한다.
     * @param date yyyy-MM-dd 형식의 날짜 문자열
     * @param userId 유저 ID
     * @return 비공부 시간 비율 또는 에러 메시지
     */
    @GetMapping("/chart/mainpage/{date}/{userId}")
    public ResponseEntity<?> getChartScoreMainPage(@PathVariable("date") String date, @PathVariable("userId") int userId){
        User user = userService.findById(userId);
        if(user == null) return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");

        LocalDate localDate = chartService.parseDate(date);
        if(localDate == null) return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다. (yyyy-MM-dd)");

        return chartService.getChartScore(user, localDate);
    }

    /**
     * 유저의 최근 1주일간 순공 시간 통계를 조회한다.
     * @param date 기준 날짜 문자열
     * @param userId 유저 ID
     * @return 날짜별 순공 시간 목록
     */
    @GetMapping("/chart/week/{userId}")
    public ResponseEntity<?> printWeekChart(@RequestParam("date") String date, @PathVariable("userId") int userId){
        User user = userService.findById(userId);
        if(user == null) return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");

        LocalDate localDate = chartService.parseDate(date);
        if(localDate == null) return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다. (yyyy-MM-dd)");

        List<ChartWeekStudyTimeResponseDto> weekChart = chartService.findWeekByDate(user, localDate);
        return (weekChart != null && !weekChart.isEmpty()) ? ResponseEntity.ok(weekChart) : ResponseEntity.noContent().build();
    }

    /**
     * 유저와 또래의 통계 평균 데이터를 조회한다.
     * @param userId 유저 ID
     * @return PeerStatisticsResponseDto
     */
    @GetMapping("/chart/avg/{userId}")
    public ResponseEntity<?> peerstatistics(@PathVariable("userId") int userId) {

        PeerStatisticsResponseDto result = chartService.getPeerStats(userId);

        if(result.getAvgFullTime() == 0.0){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(result);
    }

    /**
     * 유저 개인의 통계 평균 데이터를 조회한다.
     * @param userId 유저 ID
     * @return UserStatisticsResponseDto
     */
    @GetMapping("/chart/{userId}")
    public ResponseEntity<?> userStatistics(@PathVariable("userId") int userId) {

        UserStatisticsResponseDto result = chartService.getUserStats(userId);
        if(result.getAvgFullTime() == 0.0){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(result);
    }
}