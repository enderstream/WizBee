package com.wizbee.backend.timelapse.service;

import com.wizbee.backend.timelapse.dto.TimeLapseFinishRequestDto;
import com.wizbee.backend.timelapse.dto.TimeLapseGetRequestDto;
import com.wizbee.backend.timelapse.Entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.repository.TimeLapseRepository;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TimeLapseService {

    private final TimeLapseRepository timelapseRepository;
    private final UserRepository userRepository;

    public TimeLapseService(TimeLapseRepository timelapseRepository, UserRepository userRepository) {
        this.timelapseRepository = timelapseRepository;
        this.userRepository = userRepository;
    }

    // 타임랩스 url 저장
    @Transactional
    public void saveTimeLapseURL (TimeLapseSaveRequestDto timeLapseSaveRequestDto, int timelapseId) {
        // TimeLapse 객체 조회
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));

        timeLapse.setUrl(timeLapseSaveRequestDto.getTimeLapseUrl());
    }

    // 타입 랩스 초기 정보 저장
    @Transactional
    public TimeLapse startTimeLapse (String machineId) {
        // 사용자 조회
        User user = userRepository.findByMachine(machineId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }

        TimeLapse timeLapse = new TimeLapse();
        timeLapse.setUser(user);
        TimeLapse savedtimeLapse = timelapseRepository.save(timeLapse);

        return savedtimeLapse;

    }

    // 타임 랩스 조회
    @Transactional(readOnly = true)
    public List<TimeLapseGetRequestDto> getTimeLapse (int userId) {
        List<TimeLapseGetRequestDto> dtos = timelapseRepository.findAllByUserId(userId);
        return dtos;
    }

    // 타임 랩스 촬영 종료
    @Transactional
    public void finishTimeLapse (TimeLapseFinishRequestDto timeLapseFinishRequestDto, int timelapseId) {
        // TimeLapse 객체 조회
        TimeLapse timeLapse = timelapseRepository.findById(timelapseId)
                .orElseThrow(() -> new RuntimeException("TimeLapse not found"));
        if (timeLapseFinishRequestDto.getTitle().equals("")){
            timeLapseFinishRequestDto.setTitle("제목없음");
        }
        timeLapse.setTitle(timeLapseFinishRequestDto.getTitle());
    }

}
