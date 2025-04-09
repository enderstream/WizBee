package com.wizbee.backend.pose.service;

import com.wizbee.backend.pose.dto.PoseImageUrlsResponseDto;
import com.wizbee.backend.pose.dto.PoseScoreAndImageSaveRequestDto;
import com.wizbee.backend.pose.dto.PoseScoreResponseDto;
import com.wizbee.backend.pose.dto.PoseUrlsDto;
import com.wizbee.backend.pose.entity.Pose;
import com.wizbee.backend.pose.entity.PoseImage;
import com.wizbee.backend.pose.repository.PoseImageRepository;
import com.wizbee.backend.pose.repository.PoseRepository;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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
    public void savePoseScore (PoseScoreAndImageSaveRequestDto poseScoreAndImageSaveRequestDto, String machineId) throws Exception{
        // 사용자 조회
        User user = userRepository.findByMachine(machineId);
        if (user == null) {
            throw new NoSuchElementException("user not found");
        }


        // DTO -> Entity
        Pose pose = new Pose();
        pose.setUser(user);
        pose.setTurtleCnt(poseScoreAndImageSaveRequestDto.getPoseTurtleCnt());
        pose.setShoulderCnt(poseScoreAndImageSaveRequestDto.getShoulderCnt());
        pose.setDownCnt(poseScoreAndImageSaveRequestDto.getDownCnt());
        pose.setDate(poseScoreAndImageSaveRequestDto.getPoseDate());

        Pose savedPose = poseRepository.save(pose);

        // 이지미 url 저장
        for (String url : poseScoreAndImageSaveRequestDto.getPoseUrl()) {
            PoseImage poseImage = new PoseImage();
            poseImage.setPose(savedPose);
            poseImage.setUser(user);
            poseImage.setImageUrl(url);
            poseImageRepository.save(poseImage);
        }
    }

    // 자세 합산 조회
    public Optional<PoseScoreResponseDto> getPoseScore(String date, int userId) {

        Date poseDate;
        try {
            poseDate = Date.valueOf(date);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid date format. Expected yyyy-MM-dd");
        }

        // 변환된 date와 userId를 사용해서 Repository 호출
        return poseRepository.findPoseScore(userId, poseDate);
    }

    // 자세 이미지 조회
    @Transactional(readOnly = true)
    public PoseImageUrlsResponseDto getPoseImageUrls(int userId, String date){
        Date poseDate;
        try {
            poseDate = Date.valueOf(date);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid date format. Expected yyyy-MM-dd");
        }

        List<PoseUrlsDto> imageUrls = poseImageRepository.findPoseImageUrls(userId, poseDate);
        PoseImageUrlsResponseDto poseImageUrlsResponseDto = new PoseImageUrlsResponseDto();
        poseImageUrlsResponseDto.setUserId(userId);
        poseImageUrlsResponseDto.setPoseDate(poseDate);
        poseImageUrlsResponseDto.setPoseImageUrls(imageUrls);
        return poseImageUrlsResponseDto;


    }

}
