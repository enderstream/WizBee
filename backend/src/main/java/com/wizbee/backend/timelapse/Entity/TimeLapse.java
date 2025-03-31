package com.wizbee.backend.timelapse.Entity;

import com.wizbee.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Date;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "timelapse")
public class TimeLapse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timelapse_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "timelapse_url", nullable = false)
    private String url;

    @Column(name = "timelapes_title", nullable = false)
    @ColumnDefault("'제목없음'")
    private String title;

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
