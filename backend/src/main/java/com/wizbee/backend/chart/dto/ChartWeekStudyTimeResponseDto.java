package com.wizbee.backend.chart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
//import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ChartWeekStudyTimeResponseDto {
    private int studyTime;
    private Date date;
}
