package com.wizbee.backend.chart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartRequestDto {
    private String rassId; // 라즈베리파이 고유 번호
    private String date;
    private Integer fullTime;
    private Integer phoneTime;
    private Integer phoneCount;
    private Integer sleepTime;
    private Integer sleepCount;
    private Integer outTime;
    private Integer outCount;
}
