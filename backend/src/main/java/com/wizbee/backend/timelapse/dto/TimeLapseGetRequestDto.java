package com.wizbee.backend.timelapse.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class TimeLapseGetRequestDto {
    private int timelapseId;
    private int userId;
    private String timelapseUrl;
    private String timelapseTitle;
    private Date timelapseDate;
    // JPQL 생성자 표현식에서 사용할 생성자 (매개변수 순서와 타입이 JPQL 쿼리와 일치해야 함)
    public TimeLapseGetRequestDto(Integer timelapseId, Integer userId, String timelapseUrl, String timelapseTitle, Date timelapseDate) {
        this.timelapseId = timelapseId;
        this.userId = userId;
        this.timelapseUrl = timelapseUrl;
        this.timelapseTitle = timelapseTitle;
        this.timelapseDate = timelapseDate;
    }

}
