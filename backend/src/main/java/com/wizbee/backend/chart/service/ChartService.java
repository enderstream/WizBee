package com.wizbee.backend.chart.service;

import com.wizbee.backend.chart.dto.PeerStatisticsResponseDto;
import com.wizbee.backend.chart.dto.UserStatisticsResponseDto;
import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.repository.ChartRepository;
import com.wizbee.backend.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
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

    public double avgOfUser(User user) {
        Double result = chartRepository.avgOfUser(user);
        return (result != null) ? result : 0.0;  // null일 경우 0.0 반환
    }

    public double avgOfUserAge(User user) {
        Date birthday = user.getBirthday();
        Double result = chartRepository.avgOfUserAge(birthday);
        return (result != null) ? result : 0.0;  // null일 경우 0.0 반환
    }


    public PeerStatisticsResponseDto getPeerStats(Integer userId) {
        Object result = chartRepository.getPeerStatistics(userId);
        if (result == null) {
            return new PeerStatisticsResponseDto();
        }
        Object[] arr = (Object[]) result;
        PeerStatisticsResponseDto peerStatisticsResponseDto = new PeerStatisticsResponseDto();
        peerStatisticsResponseDto.setAvgFullTime(((BigDecimal) arr[0]).floatValue());
        peerStatisticsResponseDto.setAvgStudyTime(((BigDecimal) arr[1]).floatValue());
        peerStatisticsResponseDto.setAvgOutTime(((BigDecimal) arr[2]).floatValue());
        peerStatisticsResponseDto.setAvgOutCnt(((BigDecimal) arr[3]).floatValue());
        peerStatisticsResponseDto.setAvgPhoneTime(((BigDecimal) arr[4]).floatValue());
        peerStatisticsResponseDto.setAvgPhoneCnt(((BigDecimal) arr[5]).floatValue());
        peerStatisticsResponseDto.setAvgSleepTime(((BigDecimal) arr[6]).floatValue());
        peerStatisticsResponseDto.setAvgSleepCnt(((BigDecimal) arr[7]).floatValue());

        return peerStatisticsResponseDto;
    }

    public UserStatisticsResponseDto getUserStats(Integer userId) {
        Object result = chartRepository.getUserStatistics(userId);
        if (result == null) {
            return new UserStatisticsResponseDto();
        }
        Object[] arr = (Object[]) result;
        UserStatisticsResponseDto userStatisticsResponseDto = new UserStatisticsResponseDto();
        userStatisticsResponseDto.setAvgFullTime(((BigDecimal) arr[0]).floatValue());
        userStatisticsResponseDto.setAvgStudyTime(((BigDecimal) arr[1]).floatValue());
        userStatisticsResponseDto.setAvgOutTime(((BigDecimal) arr[2]).floatValue());
        userStatisticsResponseDto.setAvgOutCnt(((BigDecimal) arr[3]).floatValue());
        userStatisticsResponseDto.setAvgPhoneTime(((BigDecimal) arr[4]).floatValue());
        userStatisticsResponseDto.setAvgPhoneCnt(((BigDecimal) arr[5]).floatValue());
        userStatisticsResponseDto.setAvgSleepTime(((BigDecimal) arr[6]).floatValue());
        userStatisticsResponseDto.setAvgSleepCnt(((BigDecimal) arr[7]).floatValue());

        return userStatisticsResponseDto;
    }

}
