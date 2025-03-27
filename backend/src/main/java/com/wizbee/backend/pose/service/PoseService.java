package com.wizbee.backend.pose.service;

import com.wizbee.backend.pose.dto.PoseStatisticsSaveRequestDto;
import com.wizbee.backend.pose.entity.Pose;
import com.wizbee.backend.pose.repository.PoseRepository;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PoseService {
    private final PoseRepository poseRepository;
    private final UserRepository userRepository;


    public PoseService(PoseRepository poseRepository, UserRepository userRepository)
    {
        this.poseRepository = poseRepository;
        this.userRepository = userRepository;
    }

    // 자세 통계 저장
    public Pose savePoseStatistics(PoseStatisticsSaveRequestDto poseStatisticsSaveRequestDto, int userId) {

        // DTO -> Entity
        Pose pose = new Pose();
        pose.setUser(userRepository.findById(userId));
        pose.setTutleCnt(poseStatisticsSaveRequestDto.getPoseTurtleCnt());
        pose.setShoulderCnt(poseStatisticsSaveRequestDto.getShoulderCnt());
        pose.setDownCnt(poseStatisticsSaveRequestDto.getDownCnt());
        pose.setDate(poseStatisticsSaveRequestDto.getPoseDate());

        return poseRepository.save(pose);


    }



}
