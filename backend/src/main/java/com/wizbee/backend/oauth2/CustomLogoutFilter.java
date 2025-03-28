package com.wizbee.backend.oauth2;

import com.wizbee.backend.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.filter.GenericFilterBean;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;  // Redis template 추가

    public CustomLogoutFilter(JWTUtil jwtUtil, StringRedisTemplate redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        // path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^\\/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }
        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        // get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        // refresh null check
        if (refresh == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Refresh token not found in cookies");
            return;
        }

        // expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            // 만료된 토큰일 경우
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Refresh token has expired");
            return;
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            // refresh 토큰이 아닐 경우
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid token category");
            return;
        }

        // Redis에 저장된 토큰 존재 여부 확인
        String email = jwtUtil.getEmail(refresh);
        String storedRefreshToken = redisTemplate.opsForValue().get(email);
        if (storedRefreshToken == null || !storedRefreshToken.equals(refresh)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Refresh token not found or mismatched");
            return;
        }


        // 로그아웃 진행
        // Redis에서 refresh 토큰 삭제
        redisTemplate.delete(email);

        // Refresh 토큰 Cookie 값 0
        Cookie accessNull = new Cookie("access", null);
        Cookie refreshNull = new Cookie("refresh", null);
        refreshNull.setMaxAge(0);
        refreshNull.setPath("/");
        accessNull.setMaxAge(0);
        accessNull.setPath("/");

        response.addCookie(refreshNull);
        response.addCookie(accessNull);

        // 3. 리다이렉트 처리 - 필터에서 리다이렉트를 직접 처리하지 않도록 수정
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("Successfully logged out");
    }
}
