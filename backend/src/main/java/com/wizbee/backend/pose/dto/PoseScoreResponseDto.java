package com.wizbee.backend.pose.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
public class PoseScoreResponseDto {
     private Integer userId;
     private Date pose_date;
     private Long sumTurtleCnt;
     private Long sumShoulderCnt;
     private Long sumDownCnt;
}
