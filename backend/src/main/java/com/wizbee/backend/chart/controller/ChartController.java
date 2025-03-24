package com.wizbee.backend.chart.controller;

import com.wizbee.backend.chart.dto.ChartRequestDto;
import com.wizbee.backend.chart.dto.ChartResponseDto;
import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.service.ChartService;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/study")
public class ChartController {

    @Autowired
    private ChartService chartService;

    @Autowired
    private UserService userService;

    /**
     * 라즈베리파이에서 전송받은 통계 정보를 DB에 저장
     * 라즈베리파이에서 넘겨받은 고유 번호로 유저 정보 조회 후
     * 그 유저 정보 기반으로 통계 정보 객체 생성
     * 생성된 통계 정보 객체를 DB에 저장
     *
     * @param chartRequestDto
     * @return
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveChart(@RequestBody ChartRequestDto chartRequestDto) {
        // 1. 유저 찾기 (라즈베리파이 ID를 통해)
        User user = userService.findByMachine(chartRequestDto.getRassId());
        if (user == null) {
            return ResponseEntity.badRequest().body("유효하지 않은 라즈베리파이 ID입니다.");
        }

        // 2. Chart 객체 생성 및 데이터 설정
        Chart chart = new Chart();
        chart.setUser(user);
        chart.setDate(java.sql.Date.valueOf(chartRequestDto.getDate()));
        chart.setFullTime(chartRequestDto.getFullTime());
        chart.setPhoneTime(chartRequestDto.getPhoneTime());
        chart.setPhoneCount(chartRequestDto.getPhoneCount());
        chart.setSleepTime(chartRequestDto.getSleepTime());
        chart.setSleepCount(chartRequestDto.getSleepCount());
        chart.setOutTime(chartRequestDto.getOutTime());
        chart.setOutCount(chartRequestDto.getOutCount());

        // 3. 순공부 시간 계산
        chart.setStudyTime(chart.getFullTime() - (chart.getOutTime() + chart.getPhoneTime() + chart.getSleepTime()));

        // 4. DB 저장
        Chart savedChart = chartService.saveChart(chart);
        if (savedChart != null) {
            return ResponseEntity.ok("통계 등록에 성공했습니다.");
        } else {
            return ResponseEntity.badRequest().body("저장 실패.");
        }
    }

    @GetMapping("/chart/{userId}")
    public ResponseEntity<?> printTodayChart(@RequestParam String date, @PathVariable("userId") int userId){
        User searchUser = userService.findById(userId);
        if(searchUser == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }

        // 날짜 변환 (String → LocalDate)
        LocalDate localDate;
        try {
            localDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE); // "yyyy-MM-dd" 형식
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다. (yyyy-MM-dd)");
        }

        // 오늘의 딴짓 통계
        Chart oneDayChart = chartService.findByDate(searchUser, localDate);

        if(oneDayChart != null){
            return ResponseEntity.ok(oneDayChart);
        } else {
            return ResponseEntity.badRequest().body("해당 날짜에 통계 정보가 없습니다.");
        }

    }


    @GetMapping("/chart/week/{userId}")
    public ResponseEntity<?> printWeekChart(@RequestParam("date") String date, @PathVariable("userId") int userId){
        User searchUser = userService.findById(userId);
        if(searchUser == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }

        // 날짜 변환 (String → LocalDate)
        LocalDate localDate;
        try {
            localDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE); // "yyyy-MM-dd" 형식
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다. (yyyy-MM-dd)");
        }

        // 이번주 순공시간 통계
        List<Object[]> weekChart = chartService.findWeekByDate(searchUser, localDate);

        if(weekChart != null){
            return ResponseEntity.ok(weekChart);
        } else {
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        }

    }

}
