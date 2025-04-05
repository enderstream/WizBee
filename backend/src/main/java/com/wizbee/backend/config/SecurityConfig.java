package com.wizbee.backend.config;

import com.wizbee.backend.oauth2.CustomLogoutFilter;
import com.wizbee.backend.jwt.JWTFilter;
import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.oauth2.CustomSuccessHandler;
import com.wizbee.backend.user.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final StringRedisTemplate redisTemplate;
    private final CustomSuccessHandler customSuccessHandler;
    private final JWTUtil jwtUtil;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, 
                          CustomSuccessHandler customSuccessHandler, 
                          JWTUtil jwtUtil, 
                          StringRedisTemplate redisTemplate) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 단일 CorsConfigurationSource 빈을 사용하여 CORS 설정 통합
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 로그아웃 필터
        http.addFilterBefore(new CustomLogoutFilter(jwtUtil, redisTemplate), LogoutFilter.class);
        // JWT 필터 추가
        http.addFilterAfter(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

        // OAuth2 로그인 설정
        http.oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint.userService(customOAuth2UserService))
            .successHandler(customSuccessHandler));

        // URL별 인가 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/oauth2/**", "/login/**",
                        "/api/v1/auth/signup", "/api/v1/auth/reissue", "/api/v1/auth/logout",
                        "/api/v1/study/save", "/api/v1/timelapse/**", "/api/v1/pose/score/**",
                        "/api/v1/timelapse/videostream")
                .permitAll()
                .anyRequest().authenticated());


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 기존의 허용 origin들을 모두 통합합니다.
        configuration.setAllowedOrigins(Arrays.asList(
                frontendUrl,                   // application.properties 에 설정된 프론트엔드 URL
                "http://localhost:3000",         // 개발용 로컬 주소
                "http://localhost:8080",         // 개발용 로컬 주소
                "http://localhost:5173",         // 개발용 로컬 주소
                "http://192.168.137.66",         // 라즈베리파이 IP1
                "http://192.168.137.126"         // 라즈베리파이 IP2
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 적용
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
