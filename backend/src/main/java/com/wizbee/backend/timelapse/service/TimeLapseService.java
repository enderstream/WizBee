package com.wizbee.backend.timelapse.service;

import com.wizbee.backend.timelapse.Entity.TimeLapse;
import com.wizbee.backend.timelapse.dto.TimeLapseSaveRequestDto;
import com.wizbee.backend.timelapse.repository.TimeLapseRepository;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class TimeLapseService {

    private final TimeLapseRepository timelapseRepository;
    private final UserRepository userRepository;

    public TimeLapseService(TimeLapseRepository timelapseRepository, UserRepository userRepository) {
        this.timelapseRepository = timelapseRepository;
        this.userRepository = userRepository;
    }

//    // 타임랩스 url 저장
//    @Transactional
//    public void saveTimeLapseURL (TimeLapseSaveRequestDto timeLapseSaveRequestDto, String machineId) {
//        // 사용자 조회
//        User user = userRepository.findByMachine(machineId);
//        if (user == null) {
//            throw new NoSuchElementException("user not found");
//        }
//
//        TimeLapse timeLapse = timelapseRepository.findByUser(user.getId());
//        timeLapse.setUrl(timeLapseSaveRequestDto.getTimeLapseUrl());
//    }

    // 타입 랩스 초기 정보 저장
    @Transactional
    public TimeLapse startTimeLapse (int userId) {
        // 사용자 조회
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }

        TimeLapse timeLapse = new TimeLapse();
        timeLapse.setUser(user);
        TimeLapse savedtimeLapse = timelapseRepository.save(timeLapse);
// 웹 소켓으로 타임랩스아이디 전송 로직(구현은 나중에)
        return savedtimeLapse;

    }

}
