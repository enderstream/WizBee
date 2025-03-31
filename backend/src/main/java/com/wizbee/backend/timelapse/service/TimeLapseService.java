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

    @Transactional
    public TimeLapse saveTimeLapse (TimeLapseSaveRequestDto timeLapseSaveRequestDto, String machineId) {
        // 사용자 조회
        User user = userRepository.findByMachine(machineId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }

        TimeLapse timeLapse = new TimeLapse();

        timeLapse.setUser(user);
        timeLapse.setUrl(timeLapseSaveRequestDto.getTimeLapseUrl());

        TimeLapse saveTimeLapse = timelapseRepository.save(timeLapse);
        return saveTimeLapse;
    }
}
