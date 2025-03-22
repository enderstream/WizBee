package com.wizbee.backend.chart.entity;

import com.wizbee.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "chart")
public class Chart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chart_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "chart_date", nullable = false)
    private java.sql.Date date;

    @Column(name = "chart_fulltime", nullable = false)
    private Integer fullTime = 0;

    @Column(name = "chart_studytime", nullable = false)
    private Integer studyTime = 0;

    @Column(name = "chart_sleepcnt", nullable = false)
    private Integer sleepCount = 0;

    @Column(name = "chart_sleeptime", nullable = false)
    private Integer sleepTime = 0;

    @Column(name = "chart_phonecnt", nullable = false)
    private Integer phoneCount = 0;

    @Column(name = "chart_phonetime", nullable = false)
    private Integer phoneTime = 0;

    @Column(name = "chart_outcnt", nullable = false)
    private Integer outCount = 0;

    @Column(name = "chart_outtime", nullable = false)
    private Integer outTime = 0;
}

