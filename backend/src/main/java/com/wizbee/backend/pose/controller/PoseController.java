package com.wizbee.backend.pose.controller;

import com.wizbee.backend.pose.dto.PoseStatisticsSaveRequestDto;
import com.wizbee.backend.pose.entity.Pose;
import com.wizbee.backend.pose.service.PoseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pose")
public class PoseController {

    private final PoseService poseService;

    public PoseController(PoseService poseService) {
        this.poseService = poseService;
    }

    // 자세 통계 저장
    @PostMapping("/score/{userId}")
    public ResponseEntity<?> savePose(@PathVariable("userId") int userId, @RequestBody PoseStatisticsSaveRequestDto poseSaveRequestDto) {
        try {
            Pose pose = poseService.savePoseStatistics(poseSaveRequestDto, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body("저장완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
