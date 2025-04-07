package com.wizbee.backend.oauth2;

import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.user.dto.CustomOAuth2User;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${FRONTEND_URL}") // application.properties에서 값 주입
    private String frontendUrl;

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserService userService;

    public CustomSuccessHandler(JWTUtil jwtUtil, RedisTemplate<String, String> redisTemplate, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        // OAuth2User 정보 가져오기
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        String username = customUserDetails.getName();
        String email = customUserDetails.getEmail();
        Integer id = customUserDetails.getId();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 토큰 생성(유효기간 10일)
        long tenDaysMs = 864000000L;
        String access = jwtUtil.createJwt("access", email, role, id, tenDaysMs);
        String refresh = jwtUtil.createJwt("refresh", email, role, id, tenDaysMs);

        redisTemplate.opsForValue().set(email, refresh, 10, TimeUnit.DAYS); // Redis 저장도 10일로 변경

        // Redis에 Refresh Token 저장 (Base64 인코딩, 7일 유효)
//        String refreshToken = Base64.getEncoder().encodeToString(refresh.getBytes(StandardCharsets.UTF_8));
//        redisTemplate.opsForValue().set(email, refresh, 7, TimeUnit.DAYS);

        // 쿠키 설정 (SameSite=None; Secure 포함)
        addSameSiteCookie(response, "access", access);
        addSameSiteCookie(response, "refresh", refresh);

    // 백엔드에서는 OAuth 인증 완료 후 프론트엔드의 전용 리다이렉트 페이지로 이동
        response.sendRedirect(frontendUrl + "/oauth-redirect");

    }

    // SameSite=None 쿠키 설정을 위한 수동 헤더 추가
    private void addSameSiteCookie(HttpServletResponse response, String name, String value) {
        String cookie = String.format(
                "%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=None",
                name, value, 864000
        );
        response.addHeader("Set-Cookie", cookie);
    }
}
