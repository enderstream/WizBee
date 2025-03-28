package com.wizbee.backend.oauth2;


import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.user.dto.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    public CustomSuccessHandler(JWTUtil jwtUtil, RedisTemplate<String, String> redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getName();
        String email = customUserDetails.getEmail();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        Integer id = customUserDetails.getId();

        //토큰 생성
        String access = jwtUtil.createJwt("access", email, role, id, 600000L);
        String refresh = jwtUtil.createJwt("refresh", email, role, id, 86400000L);

        // UTF-8로 인코딩된 refreshToken 생성
        String refreshToken = Base64.getEncoder().encodeToString(refresh.getBytes(StandardCharsets.UTF_8));
        // Redis에 Refresh Token 저장 (만료 시간 7일)
        redisTemplate.opsForValue().set(email, refreshToken, 7, TimeUnit.DAYS);

        response.addCookie(createCookie("access", access));
        response.addCookie(createCookie("refresh", refresh));
        response.sendRedirect("http://localhost:3000");
//        response.sendRedirect("${FRONTEND_URL}");
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}