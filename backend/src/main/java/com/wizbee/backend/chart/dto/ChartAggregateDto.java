// ChartAggregateDto.java
package com.wizbee.backend.chart.dto;

import com.wizbee.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
public class ChartAggregateDto {

    private int fullTime;
    private int studyTime;
    private int sleepTime;
    private int phoneTime;
    private int outTime;
    private int sleepCount;
    private int phoneCount;
    private int outCount;
    private Date date;
    private User user;

    public ChartAggregateDto(Long fullTime, Long studyTime, Long sleepTime,
                             Long phoneTime, Long outTime, Long sleepCount,
                             Long phoneCount, Long outCount, Date date, User user) {
        this.fullTime = fullTime != null ? fullTime.intValue() : 0;
        this.studyTime = studyTime != null ? studyTime.intValue() : 0;
        this.sleepTime = sleepTime != null ? sleepTime.intValue() : 0;
        this.phoneTime = phoneTime != null ? phoneTime.intValue() : 0;
        this.outTime = outTime != null ? outTime.intValue() : 0;
        this.sleepCount = sleepCount != null ? sleepCount.intValue() : 0;
        this.phoneCount = phoneCount != null ? phoneCount.intValue() : 0;
        this.outCount = outCount != null ? outCount.intValue() : 0;
        this.date = date;
        this.user = user;
    }

}
