package com.wizbee.backend.pose.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class PoseScoreAndImageSaveRequestDto {
    private int poseTurtleCnt;
    private int shoulderCnt;
    private int downCnt;
    private Date poseDate;
    private List<String> poseUrl;
}
