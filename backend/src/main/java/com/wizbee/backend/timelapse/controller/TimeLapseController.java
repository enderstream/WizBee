package com.wizbee.backend.timelapse.controller;


import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.timelapse.dto.TimeLapseFinishRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.service.RaspberryApiService;
import com.wizbee.backend.timelapse.service.TimeLapseService;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/timelapse")
@Slf4j
public class TimeLapseController {
    private final TimeLapseService timelapseService;
    private final RaspberryApiService raspberryApiService;
    private final UserService userService;
    private final JWTUtil jwtUtil;
    public TimeLapseController(TimeLapseService timelapseService,
                               UserService userService,
                               RaspberryApiService raspberryApiService,
                               JWTUtil jwtUtil) {
        this.timelapseService = timelapseService;
        this.userService = userService;
        this.raspberryApiService = raspberryApiService;
        this.jwtUtil = jwtUtil;
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
    public Mono<ResponseEntity<Object>> startTimeLapse(@PathVariable("machineId") String machineId) {
        return timelapseService.startTimeLapse(machineId)
                .map(timeLapse -> ResponseEntity.status(HttpStatus.CREATED).body((Object) timeLapse))
                .onErrorResume(error ->
                        Mono.just(ResponseEntity.<Object>badRequest().body("Error: " + error.getMessage()))
                );
    }

    // 타임랩스 촬영 종료
    // 라파에 촬영 종료 알리기
    @PutMapping("/finish/{timelapseId}")
    public Mono<ResponseEntity<Object>> finishTimeLapse(@RequestBody TimeLapseFinishRequestDto timeLapseFinishRequestDto,
                                             @PathVariable("timelapseId") int timelapseId){
        return timelapseService.finishTimeLapse(timeLapseFinishRequestDto, timelapseId)
                .map(timeLapse -> ResponseEntity.ok().body((Object)"제목 저장"))
                .onErrorResume(error ->
                        Mono.just(ResponseEntity.badRequest().body((Object)("Error: " + error.getMessage())))
                );
    }

    /*
    1. 비디오 스트림 요청
    2. 비디오 스트림 url 전달
     */
    @GetMapping("/stream/{machineId}")
    public Mono<ResponseEntity<String>> getStreamUrl(@PathVariable("machineId") String machineId,
                                                     HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for(Cookie cookie : cookies) {
                if("access".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if ( token == null ) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT token not found in cookies"));

        }

        int userId = jwtUtil.getId(token);

        User currentUser = userService.findById(userId);

        // 만약 현재 사용자의 machineId가 다르면
        if(!machineId.equals(currentUser.getMachine())) {
            return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized: machineId mismatch"));
        }

        return raspberryApiService.getStreamUrl()
                .map(url -> ResponseEntity.ok(url))
                .onErrorResume(error ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: " + error.getMessage()))
                );

    }


    /*
    삭제요청
    1. 사용자가 맞는지 확인한다.
    2. 맞으면 삭제 진행 아니면 에러 반환
     */
    @DeleteMapping("/{timelapseId}")
    public ResponseEntity<?> deleteTimeLapse(@PathVariable("timelapseId") int timelapseId, Principal principal) {
        String currentUserEmail = principal.getName();
        System.out.println(currentUserEmail);
        try {
            timelapseService.deleteTimeLapse(timelapseId, currentUserEmail);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }

    /*
    타임랩스 제목 수정 요청
    1. 사용자가 맞는지 확인한다.
    2. 맞으면 수정 진행 아니면 에러 반환
     */
    @PutMapping("/update-title/{timelapseId}")
    public ResponseEntity<?> updateTimeLapseTitle(@PathVariable("timelapseId") int timelapseId,
                                                  @RequestBody TimeLapseFinishRequestDto dto,
                                                  Principal principal) {

        String currentUserEmail = principal.getName();
        System.out.println(currentUserEmail);
        try{
            timelapseService.updateTimeLapseTitle(timelapseId, currentUserEmail, dto);
            return ResponseEntity.ok("제목 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: "  + e.getMessage());
        }
    }



}
