package com.wizbee.backend.pose.controller;

import com.wizbee.backend.pose.dto.PoseImageUrlsResponseDto;
import com.wizbee.backend.pose.dto.PoseScoreAndImageSaveRequestDto;
import com.wizbee.backend.pose.dto.PoseScoreResponseDto;
import com.wizbee.backend.pose.entity.Pose;
import com.wizbee.backend.pose.service.PoseService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/pose")
public class PoseController {

    private final PoseService poseService;

    public PoseController(PoseService poseService) {
        this.poseService = poseService;
    }

    // 자세 통계 저장
    @PostMapping("/score/{machineId}")
    public ResponseEntity<?> savePose(@PathVariable("machineId") String machineId, @RequestBody PoseScoreAndImageSaveRequestDto poseSaveRequestDto) {
        try {
            poseService.savePoseScore(poseSaveRequestDto, machineId);
            return ResponseEntity.status(HttpStatus.CREATED).body("저장완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 자세 통계 조회
    @GetMapping("/score/{date}/{userId}")
    public ResponseEntity<?> getPoseScore(@PathVariable("date") String date, @PathVariable("userId") int userId) {
        try {
            Optional<PoseScoreResponseDto> result = poseService.getPoseScore(date, userId);
            if (result.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 자세 이미지 조회
    @GetMapping("/image/{date}/{userId}")
    public ResponseEntity<?> getPoseImage(@PathVariable("date") String date, @PathVariable("userId") int userId){
        try {
            PoseImageUrlsResponseDto poseImageUrlsResponseDto = poseService.getPoseImageUrls(userId, date);
            if(poseImageUrlsResponseDto.getPoseImageUrls() == null ||
                    poseImageUrlsResponseDto.getPoseImageUrls().isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(poseImageUrlsResponseDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }

}
