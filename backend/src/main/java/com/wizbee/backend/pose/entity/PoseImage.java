package com.wizbee.backend.pose.entity;

import com.wizbee.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "poseimage")
@Getter
@Setter
@NoArgsConstructor
public class PoseImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poseimage_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pose_id", nullable = false)
    private Pose pose;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "poseimage_url", nullable = false)
    private String imageUrl;

}
