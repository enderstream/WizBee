package com.wizbee.backend.chart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.sql.Date;

@Getter
@AllArgsConstructor
public class ChartResponseDto {
    private Integer fullTime;
    private Date date;
    private Integer outCount;
    private Integer outTime;
    private Integer phoneCount;
    private Integer phoneTime;
    private Integer sleepCount;
    private Integer sleepTime;
    private Integer studyTime;


}
