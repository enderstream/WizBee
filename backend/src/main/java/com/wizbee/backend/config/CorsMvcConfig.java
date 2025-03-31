package com.wizbee.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
                .exposedHeaders("Set-Cookie")
                .allowedOrigins("http://192.168.137.66",   // 라즈베리파이 IP1
                        "http://192.168.137.126")  // 라즈베리파이 IP2
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 필요한 메서드만 허용
                .allowCredentials(true);
    }
}
