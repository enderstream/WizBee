package com.wizbee.backend.pose.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class PoseStatisticsSaveRequestDto {
    private int poseTurtleCnt;
    private int shoulderCnt;
    private int downCnt;
    private Date poseDate;
}
