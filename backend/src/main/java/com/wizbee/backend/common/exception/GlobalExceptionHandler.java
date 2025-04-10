package com.wizbee.backend.common.exception;


import com.wizbee.backend.common.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 날짜 형식 오류
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgumentException(IllegalArgumentException e) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setTimeStamp(LocalDateTime.now());
        dto.setError("날짜가 올바르지 않습니다.");
        dto.setMessage((e.getMessage() == null || e.getMessage().isEmpty())
                ? "유효하지 않은 날짜 형식입니다."
                : e.getMessage()
        );
        return new ResponseEntity<>(dto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException e) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setTimeStamp(LocalDateTime.now());
        dto.setError(e.getErrorCode().getMessage());
        dto.setMessage(e.getMessage());
        return new ResponseEntity<>(dto, e.getErrorCode().getHttpStatus());
    }



    // 기타 모든 예외 처리
    @ExceptionHandler
    public ResponseEntity<ErrorResponseDto> handleGlobalExcption(Exception e) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setTimeStamp(LocalDateTime.now());
        dto.setError("Internal Server Error");
        dto.setMessage(e.getMessage());
        return new ResponseEntity<>(dto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
