package com.wizbee.backend.pose.service;

import com.wizbee.backend.pose.dto.PoseScoreAndImageSaveRequestDto;
import com.wizbee.backend.pose.entity.Pose;
import com.wizbee.backend.pose.entity.PoseImage;
import com.wizbee.backend.pose.repository.PoseImageRepository;
import com.wizbee.backend.pose.repository.PoseRepository;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class PoseService {
    private final PoseRepository poseRepository;
    private final UserRepository userRepository;
    private final PoseImageRepository poseImageRepository;


    public PoseService(PoseRepository poseRepository, UserRepository userRepository,PoseImageRepository poseImageRepository)
    {
        this.poseRepository = poseRepository;
        this.userRepository = userRepository;
        this.poseImageRepository = poseImageRepository;
    }

    // 자세 통계 저장
    @Transactional
    public void savePoseStatistics (PoseScoreAndImageSaveRequestDto poseStatisticsSaveRequestDto, int userId) throws Exception{
        // 사용자 조회
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }


        // DTO -> Entity
        Pose pose = new Pose();
        pose.setUser(user);
        pose.setTutleCnt(poseStatisticsSaveRequestDto.getPoseTurtleCnt());
        pose.setShoulderCnt(poseStatisticsSaveRequestDto.getShoulderCnt());
        pose.setDownCnt(poseStatisticsSaveRequestDto.getDownCnt());
        pose.setDate(poseStatisticsSaveRequestDto.getPoseDate());

        Pose savedPose = poseRepository.save(pose);

        // 이지미 url 저장
        for (String url : poseStatisticsSaveRequestDto.getPoseUrl()) {
            PoseImage poseImage = new PoseImage();
            poseImage.setPose(savedPose);
            poseImage.setUser(user);
            poseImage.setImageUrl(url);
            poseImageRepository.save(poseImage);
        }
    }

}
