package com.wizbee.backend.chart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatisticsResponseDto {

    private float avgFullTime; // 평균 총 공부시간
    private float avgStudyTime; // 평균 순 공부시간
    private float avgOutTime;
    private float avgOutCnt;
    private float avgPhoneTime;
    private float avgPhoneCnt;
    private float avgSleepTime;
    private float avgSleepCnt;
}
