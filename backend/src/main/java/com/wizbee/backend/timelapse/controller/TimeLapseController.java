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

    // 타임 랩스 영상 url db 저장
    @PostMapping("/{machineId}")
    public ResponseEntity<?> getTimelapseVideo(@RequestBody TimeLapseSaveRequestDto timeLapseSaveRequestDto, @PathVariable("machineId") String machineId) {
        try{
            TimeLapse timeLapse = timelapseService.saveTimeLapse(timeLapseSaveRequestDto, machineId);
            if (timeLapse == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("실패");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());

        }
    }
}
