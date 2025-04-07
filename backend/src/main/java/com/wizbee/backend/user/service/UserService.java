package com.wizbee.backend.user.service;

import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.user.dto.UserResponseDto;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtil jwtUtil;

    /**
     * 기기 ID를 통해 유저 조회
     * @param rassId 기기 ID
     * @return 조회된 유저 또는 null
     */
    public User findByMachine(String rassId) {
        return userRepository.findByMachine(rassId);
    }

    /**
     * 유저 ID로 유저 조회
     * @param id 유저 ID
     * @return 유저 객체 또는 null
     */
    public User findById(int id){
        return userRepository.findById(id);
    }

    /**
     * 로그인된 유저 ID로 유저 조회 (findById와 동일한 로직)
     * @param id 유저 ID
     * @return 유저 객체 또는 null
     */
    public User findLoginUserById(int id){
        return userRepository.findById(id);
    }

    /**
     * 유저 정보를 저장 또는 수정
     * @param user 저장할 유저 객체
     * @return 저장된 유저 객체
     */
    public User saveUser(User user){
        return userRepository.save(user);
    }

    /**
     * 이메일을 통해 유저 조회
     * @param email 유저 이메일
     * @return 유저 객체 또는 null
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * 유저 정보 업데이트 (닉네임 + 생년월일 + role 조건부 변경)
     * @param userId 수정 대상 유저 ID
     * @param inputUser 수정할 정보가 담긴 유저 객체
     * @return 처리 결과 ResponseEntity
     */
    public ResponseEntity<?> updateUserProfile(int userId, User inputUser) {
        User user = findById(userId);
        if(user == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }
        user.setBirthday(inputUser.getBirthday());
        user.setName(inputUser.getName());
        if("NO_BIRTH_USER".equals(user.getRole()) && inputUser.getBirthday() != null){
            user.setRole("USER");
        }
        User saved = saveUser(user);
        return saved != null ? ResponseEntity.ok("회원 정보 수정이 정상적으로 완료되었습니다.")
                : ResponseEntity.badRequest().body("잘못된 요청입니다.");
    }

    /**
     * access 토큰으로부터 유저 정보를 조회
     * @param token access 토큰 문자열
     * @return 유저 정보 또는 오류 메시지
     */
    public ResponseEntity<?> searchUserByToken(String token) {
        if (token == null) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Access token not found in cookies");
        }
        int userId;
        try {
            userId = jwtUtil.getId(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).body("Invalid access token");
        }
        User user = findLoginUserById(userId);
        return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
    }

    /**
     * 유저 탈퇴 처리 (role을 WITHDRAW_USER로 변경)
     * @param userId 탈퇴할 유저 ID
     * @return 처리 결과 ResponseEntity
     */
    public ResponseEntity<?> withdrawUser(int userId) {
        User user = findById(userId);
        if(user == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }
        user.setRole("WITHDRAW_USER");
        User saved = saveUser(user);
        return saved != null ? ResponseEntity.ok("회원 탈퇴가 정상적으로 완료되었습니다.")
                : ResponseEntity.badRequest().body("잘못된 요청입니다.");
    }

    /**
     * 유저의 기기 ID를 저장
     * @param userId 유저 ID
     * @param machineId 저장할 기기 ID
     * @return 처리 결과 ResponseEntity
     */
    public ResponseEntity<?> updateUserMachine(int userId, String machineId) {
        User user = findById(userId);
        if(user == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }
        user.setMachine(machineId);
        User saved = saveUser(user);
        return saved != null ? ResponseEntity.ok("기기 등록이 정상적으로 완료되었습니다.")
                : ResponseEntity.badRequest().body("잘못된 요청입니다.");
    }

    /**
     * 구글 로그인 이후 회원가입 처리
     * 닉네임, 생년월일, role 설정
     * @param token access 토큰 쿠키 값
     * @param request 유저 정보 DTO
     * @return 처리 결과 ResponseEntity
     */
    public ResponseEntity<?> signupUser(String token, UserResponseDto request) {
        String jwt = token.replace("access", "");
        Integer id = jwtUtil.getId(jwt);
        User user = findById(id);
        user.setName(request.getName());
        user.setBirthday(request.getBirthday());
        user.setRole("USER");
        saveUser(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }
}
