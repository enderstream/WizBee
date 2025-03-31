package com.wizbee.backend.timelapse.entity;

import com.wizbee.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "timelapse")
@Builder
public class TimeLapse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timelapse_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "timelapse_url")
    private String url;

    @Column(name = "timelapes_title", nullable = false)
    @Builder.Default
    private String title = "제목없음";

    @Column(name = "timelapse_date", nullable = false)
    private Date date;


    // 자동으로 한국 시간 날짜 저장
    @PrePersist
    public void prePersist() {
        if (date == null) {
            // 현재 대한민국 시간 기준으로 날짜 설정
            ZonedDateTime seoulDateTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            this.date = Date.valueOf(seoulDateTime.toLocalDate());
        }
    }
}
