package com.wizbee.backend.pose.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class PoseDto {
    private int poseId;
    private int userId;
    private int TurtleCnt;
    private int shoulderCnt;
    private int downCnt;
    private Date poseDate;
}
