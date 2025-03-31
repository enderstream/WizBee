package com.wizbee.backend.timelapse.controller;

import com.wizbee.backend.timelapse.Entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.service.TimeLapseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/timelapse")
public class TimeLapseController {
    private final TimeLapseService timelapseService;

    public TimeLapseController(TimeLapseService timelapseService) {
        this.timelapseService = timelapseService;
    }

    // 타입 랩스 영상 목록 조회 api

    // 타임 랩스 영상 url db 저장(라즈베리파이에서 보내는 것)
    @PutMapping("/{timelapseId}")
    public ResponseEntity<?> saveTimeLapseVideoURL(@RequestBody TimeLapseSaveRequestDto timeLapseSaveRequestDto, @PathVariable("timelapseId") int timelapseId) {
        try{
            timelapseService.saveTimeLapseURL(timeLapseSaveRequestDto, timelapseId);

            return ResponseEntity.ok("URL 저장 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());

        }
    }

    // 타임랩스 촬영 시작(db에 기본적인 내용을 담은 entity 생성)
    @PostMapping("/{userId}")
    public ResponseEntity<?> startTimeLapse(@PathVariable("userId") int userId) {
        try {
            TimeLapse timeLapse = timelapseService.startTimeLapse(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(timeLapse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }
}
