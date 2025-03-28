package com.wizbee.backend.user.dto;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Integer id;
    private String name;
    private String email;
    private String birthday;
    private String role;
    private String machine;



}
