package com.wizbee.backend.timelapse.service;

import com.wizbee.backend.timelapse.dto.TimeLapseFinishRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import com.wizbee.backend.timelapse.Entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.repository.TimeLapseRepository;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Slf4j
public class TimeLapseService {

    private final TimeLapseRepository timelapseRepository;
    private final UserRepository userRepository;
    private final RaspberryApiService raspberryApiService;



    public TimeLapseService(TimeLapseRepository timelapseRepository,
                            UserRepository userRepository,
                            RaspberryApiService raspberryApiService) {
        this.timelapseRepository = timelapseRepository;
        this.userRepository = userRepository;
        this.raspberryApiService = raspberryApiService;
    }

    // 타임랩스 url 저장
    @Transactional
    public void saveTimeLapseURL (TimeLapseSaveRequestDto timeLapseSaveRequestDto, int timelapseId) {
        // TimeLapse 객체 조회
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));

        timeLapse.setUrl(timeLapseSaveRequestDto.getTimeLapseUrl());
    }


    /*
     1. DB에 타임랩스 엔티티를 저장하고, 저장된 엔티티를 반환
     2. 라즈베리파이 서버에 촬영 시작 요청을 보내고, 그 결과(또는 에러)를 reactive 체인으로 전파
     */


    @Transactional
    public Mono<TimeLapse> startTimeLapse (String machineId) {
        // 사용자 조회
        User user = userRepository.findByMachine(machineId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }

        return Mono.fromCallable(() -> {
            TimeLapse timeLapse = new TimeLapse();
            timeLapse.setUser(user);
            TimeLapse savedTimeLapse = timelapseRepository.save(timeLapse);
            return savedTimeLapse;
        })
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(savedTimeLapse ->
            // 라즈베리파이 서버에 촬영 시작 요청 보내고, 그 후 저장된 엔티티 반환
            raspberryApiService.sendStartTimeLapseRequest(savedTimeLapse.getId())
            .then(Mono.just(savedTimeLapse))
        )
        .doOnSuccess(timeLapse -> log.info("촬영 시작 프로세스 완료 - timeLapseId: {}", timeLapse.getId()))
        .doOnError(error -> log.error("촬영 시작 프로세스 에러", error));
    }

    // 타임 랩스 조회
    @Transactional(readOnly = true)
    public List<TimeLapseGetRequestDto> getTimeLapse (int userId) {
        List<TimeLapseGetRequestDto> dtos = timelapseRepository.findAllByUserId(userId);
        return dtos;
    }


    @Transactional
    public TimeLapse finishTimeLapseSync(TimeLapseFinishRequestDto dto, int timelapseId) {
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));

        // 제목 수정
        if (dto.getTitle().equals("")){
            timeLapse.setTitle("제목없음");
        } else {
            timeLapse.setTitle(dto.getTitle());
        }
        System.out.println(timeLapse.getTitle());
        return timelapseRepository.save(timeLapse);
    }



    // 타임 랩스 촬영 종료
    @Transactional
    public Mono<TimeLapse> finishTimeLapse (TimeLapseFinishRequestDto timeLapseFinishRequestDto, int timelapseId) {

        return Mono.fromCallable(() -> finishTimeLapseSync(timeLapseFinishRequestDto, timelapseId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(updatedTimeLapse ->
                // 라즈베리파이 서버에 촬영 종료 요청을 보내고, 성공하면 업데이트된 엔티티를 반환
                raspberryApiService.sendFinishTimeLapseRequest(timelapseId)
                        .then(Mono.just(updatedTimeLapse))
        )
        .doOnSuccess(timeLapse -> log.info("촬영 종료 프로세스 완료 - timeLapseId: {}", timeLapse.getId()))
        .doOnError(error -> log.error("촬영 종료 프로세스 에러", error));


    }


    // 타임랩스 삭제 요청
    @Transactional
    public void deleteTimeLapse(int timelapseId, String currentUserEmail) {
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));

        // 사용자 검증 과정
        if (!timeLapse.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Unauthorizer delete attempt");
        }

        // 사용자 검증 통과
        timelapseRepository.delete(timeLapse);
    }

    // 타임랩스 제목 수정 요청
    @Transactional
    public void updateTimeLapseTitle(int timelapseId, String currentUserEmail, TimeLapseFinishRequestDto dto) {
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));

        System.out.println(timeLapse.getUser().getEmail());
        // 사용자 검증 과정
        if (!timeLapse.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Unauthorizer delete attempt");
        }
        timeLapse.setTitle(dto.getTitle());

    }
}
