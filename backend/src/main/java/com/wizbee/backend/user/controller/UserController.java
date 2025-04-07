package com.wizbee.backend.user.controller;

import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.user.dto.UserResponseDto;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtil jwtUtil;

    /**
     * 유저 정보 수정 메서드
     * userId로 등록된 회원 정보 가져오기
     * 수정된 회원정보 반영
     * 이때, 생년월일을 처음 등록하는 유저의 경우 role도 함께 업데이트 해주기
     * 입력 받는 정보는 닉네임 + 생년월일
     *
     * @param inputUser 수정할 유저 정보 (닉네임, 생일)
     * @param userId 수정 대상 유저 ID
     * @return 수정 결과 ResponseEntity
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@RequestBody User inputUser, @PathVariable("userId") int userId){
        return userService.updateUserProfile(userId, inputUser);
    }

    /**
     * 쿠키에 저장된 access 토큰을 통해 로그인한 유저 정보 조회
     *
     * @param request HttpServletRequest 객체에서 쿠키를 추출
     * @return 유저 정보 또는 오류 메시지
     */
    @GetMapping("/searchUser")
    public ResponseEntity<?> searchUser(HttpServletRequest request) {
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        return userService.searchUserByToken(token);
    }

    /**
     * 유저 탈퇴 메서드
     * 유저 상태를 WITHDRAW_USER 로 변경
     *
     * @param userId 탈퇴할 유저 ID
     * @return 탈퇴 결과 ResponseEntity
     */
    @PutMapping("/withdraw/{userId}")
    public ResponseEntity<?> withDrawUser(@PathVariable("userId") int userId){
        return userService.withdrawUser(userId);
    }

    /**
     * 유저의 기기 ID 저장
     *
     * @param userId 유저 ID
     * @param machineId 저장할 기기 ID
     * @return 등록 결과 ResponseEntity
     */
    @PutMapping("/machine/{userId}")
    public ResponseEntity<?> saveMachine (@PathVariable("userId") int userId, @RequestParam("machineId") String machineId){
        return userService.updateUserMachine(userId, machineId);
    }

    /**
     * 구글 로그인 후 유저 회원가입 처리
     * 닉네임, 생년월일, role("USER")을 등록
     *
     * @param token access 토큰 쿠키 값
     * @param request 회원가입 정보 DTO
     * @return 가입 결과 ResponseEntity
     */
    @PutMapping("/signup")
    public ResponseEntity<?> signup(@CookieValue("access") String token, @RequestBody UserResponseDto request){
        return userService.signupUser(token, request);
    }
}
