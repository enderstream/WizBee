package com.wizbee.backend.pose.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class PoseImageUrlsResponseDto {
    private Integer userId;
    private Date poseDate;
    private List<PoseUrlsDto> poseImageUrls;
}
