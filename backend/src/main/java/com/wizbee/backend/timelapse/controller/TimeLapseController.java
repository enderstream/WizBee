package com.wizbee.backend.timelapse.controller;


import com.wizbee.backend.timelapse.dto.TimeLapseFinishRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.service.TimeLapseService;
import com.wizbee.backend.user.service.UserService;
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

    // react에서 비디오 스트림 보내기 요청 받는 API
    // 라파에 비디오 스트림 보내 달라고 요청 받는 aPI
//    @GetMapping(value = "/videostream", produces = "multipart/x-mixed-replace; boundary=frame")
//    public Mono<Void> streamVideoFlush(ServerHttpResponse response) {
//        // 1. 응답 헤더에 Content-Type 설정
//        response.getHeaders().setContentType(
//                MediaType.parseMediaType("multipart/x-mixed-replace; boundary=frame")
//        );
//
//        // 2. timelapseService로부터 FastAPI 서버에서 받은 비디오 스트림(Flux<DataBuffer>)을 가져옴
//        Flux<DataBuffer> videoStream = timelapseService.getVideoStream();
//
//        // 3. writeAndFlushWith()를 사용해 각 데이터 청크를 개별 Flux로 감싸서 flush를 강제함
//        //    각 데이터 청크가 전송될 때마다 내부적으로 flush가 호출되어, 버퍼링 없이 클라이언트로 전달됨
//        return response.writeAndFlushWith(
//                videoStream.map(dataBuffer -> {
//                    // 각 DataBuffer를 Flux.just()로 래핑
//                    // -> 즉, 하나의 데이터 청크마다 별도의 Publisher를 생성하여 flush를 보장
//                    return Flux.just(dataBuffer);
//                })
//        );
//    }

    /*
    삭제요청
    1. 사용자가 맞는지 확인한다.
    2. 맞으면 삭제 진행 아니면 에러 반환
     */
    @DeleteMapping("/{timelapseId}")
    public ResponseEntity<?> deleteTimeLapse(@PathVariable("timelapseId") int timelapseId, Principal principal) {
        String currentUserEmail = principal.getName();
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
        try{
            timelapseService.updateTimeLapseTitle(timelapseId, currentUserEmail, dto);
            return ResponseEntity.ok("제목 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: "  + e.getMessage());
        }
    }



}
