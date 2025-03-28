package com.wizbee.backend.user.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Integer id;
    private String name;
    private String email;
    private Date birthday;
    private String role;
    private String machine;

}
