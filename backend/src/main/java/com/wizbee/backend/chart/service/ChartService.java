package com.wizbee.backend.chart.service;

import com.wizbee.backend.chart.dto.ChartResponseDto;
import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.repository.ChartRepository;
import com.wizbee.backend.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.sql.Date;
import java.util.List;

@Service
public class ChartService {

    @Autowired
    ChartRepository chartRepository;

    public Chart saveChart(Chart chart){
        return chartRepository.save(chart);
    }

    public Chart findByDate(User user, LocalDate date){
//        Object[] result = chartRepository.findByDate(user, date);
        Chart result = chartRepository.findByDate(user, date);
        if (result == null) {
            return null;
        }

        return result;
//        return new ChartResponseDto(
//                ((Number) result[0]).intValue(), // fullTime (Integer로 변환)
//                (Date) result[1],          // date
//                ((Number) result[2]).intValue(), // outCount
//                ((Number) result[3]).intValue(), // outTime
//                ((Number) result[4]).intValue(), // phoneCount
//                ((Number) result[5]).intValue(), // phoneTime
//                ((Number) result[6]).intValue(), // sleepCount
//                ((Number) result[7]).intValue(), // sleepTime
//                ((Number) result[8]).intValue()  // studyTime
//        );
    }

    public List<Object[]> findWeekByDate(User user, LocalDate date){

        LocalDate endDate = date; // 오늘 날짜
        LocalDate startDate = endDate.minusDays(6); // 7일 전 날짜

        List<Object[]> result = chartRepository.findWeekByDate(user, startDate, endDate);

        if(result == null){
            return null;

        }
        return result;
    }

}
