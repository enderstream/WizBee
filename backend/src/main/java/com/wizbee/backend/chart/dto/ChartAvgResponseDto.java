package com.wizbee.backend.chart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChartAvgResponseDto {
    private double userAvg;
    private double userYearAvg;
}
