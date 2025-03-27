package com.wizbee.backend.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Integer id;
    private String role;
    private String name;
    private String email;
}