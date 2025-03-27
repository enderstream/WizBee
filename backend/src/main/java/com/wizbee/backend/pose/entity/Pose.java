package com.wizbee.backend.pose.entity;

import com.wizbee.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "pose")
@Getter
@Setter
@NoArgsConstructor
public class Pose {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pose_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pose_tutlecnt", nullable = false)
    private Integer tutleCnt = 0;

    @Column(name = "pose_shouldercnt", nullable = false)
    private Integer shoulderCnt = 0;

    @Column(name = "pose_downcnt", nullable = false)
    private Integer downCnt = 0;

    @Column(name = "pose_date", nullable = false)
    private Date date;
}
