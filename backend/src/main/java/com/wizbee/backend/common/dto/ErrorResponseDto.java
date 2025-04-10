package com.wizbee.backend.common.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ErrorResponseDto {
    private LocalDateTime timeStamp;
    private String error;
    private String message;
}
