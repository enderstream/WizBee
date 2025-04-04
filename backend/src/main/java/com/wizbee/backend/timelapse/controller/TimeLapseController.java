package com.wizbee.backend.timelapse.controller;


import com.wizbee.backend.timelapse.dto.TimeLapseFinishRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import com.wizbee.backend.timelapse.Entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.service.TimeLapseService;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/timelapse")
public class TimeLapseController {
    private final TimeLapseService timelapseService;
    private final UserService userService;
    public TimeLapseController(TimeLapseService timelapseService,
                               UserService userService) {
        this.timelapseService = timelapseService;
        this.userService = userService;
    }

    // 타입 랩스 영상 목록 조회 api
    @GetMapping("/{userId}")
    public ResponseEntity<?> getTimeLapse(@PathVariable("userId") int userId) {
        try {
            List<TimeLapseGetRequestDto> result = timelapseService.getTimeLapse(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }
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
    // 라파에 촬영 시작 알리기
    @PostMapping("/{machineId}")
    public ResponseEntity<?> startTimeLapse(@PathVariable("machineId") String machineId) {


        try {
            TimeLapse timeLapse = timelapseService.startTimeLapse(machineId);
            // 촬영시작 API 라파에 호출
            return ResponseEntity.status(HttpStatus.CREATED).body(timeLapse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }

    // 타임랩스 촬영 종료
    // 라파에 촬영 종료 알리기
    @PutMapping("/finish/{timelapseId}")
    public ResponseEntity<?> finishTimeLapse(@RequestBody TimeLapseFinishRequestDto timeLapseFinishRequestDto,
                                             @PathVariable("timelapseId") int timelapseId,
                                             Principal principal){
        try {
            String currentUserEmail = principal.getName();
            User user = userService.findByEmail(currentUserEmail);
            String machineId = user.getMachine();
            // 타임 랩스 촬영 종료 API 라파에 호출
            timelapseService.finishTimeLapse(timeLapseFinishRequestDto, timelapseId);
            return ResponseEntity.ok("제목 저장");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // react에서 비디오 스트림 보내기 요청 받는 API
    // 라파에 비디오 스트림 보내 달라고 요청 받는 aPI

}
