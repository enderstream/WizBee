package com.wizbee.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    /*
        webclient 빈 생성 및 baseurl, default headers 등 공통 설정
     */

    @Value("${RASPBERRY.PI.URL}")
    private String raspberryPiUrl;

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                // 기본 url 설정
                .baseUrl(raspberryPiUrl) // 라즈베리파이 서버의 API 앤드포인트
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
