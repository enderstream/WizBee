package com.wizbee.backend.chart.controller;

import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.service.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/study")
public class ChartController {

    @Autowired
    private ChartService chartService;

    /**
     * 라즈베리파이에서 전송받은 통계 정보를 DB에 저장
     * 
     * @param chart
     * @return
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveChart(@RequestBody Chart chart){
        // 받은 통계 자료 기반으로 순공부 시간 계산
        chart.setStudyTime(chart.getFullTime() - (chart.getOutTime() + chart.getPhoneTime() + chart.getSleepTime()));
        // DB에 저장
        Chart savedChart = chartService.saveChart(chart);

        if(savedChart != null){
            return ResponseEntity.ok("통계 등록에 성공했습니다.");
        } else {
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        }
    }

}
