package com.wizbee.backend.user.controller;

import com.wizbee.backend.jwt.JWTUtil;
import com.wizbee.backend.user.dto.UserResponseDto;
import com.wizbee.backend.user.entity.User;
import com.wizbee.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
     * @param inputUser
     * @return
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@RequestBody User inputUser, @PathVariable("userId") int userId){
        User searchUser = userService.findById(userId);
        if(searchUser == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }

        searchUser.setBirthday(inputUser.getBirthday());
        searchUser.setName(inputUser.getName());
        // 생년월일을 처음으로 입력한 유저일 경우
        if(searchUser.getRole().equals("NO_BIRTH_USER") && inputUser.getBirthday() != null){
            searchUser.setRole("USER");
        }

        User saveUser = userService.saveUser(searchUser);
        if(saveUser == null){
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        } else {
            return ResponseEntity.ok("회원 정보 수정이 정상적으로 완료되었습니다.");
        }

    }

    @GetMapping("/{userId}")

    public ResponseEntity<?> searchUser(@PathVariable("userId") int userId){
        User user = userService.findLoginUserById(userId);

        if(user == null){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(user);
        }
    }

    @PutMapping("/withdraw/{userId}")
    public ResponseEntity<?> withDrawUser(@PathVariable("userId") int userId){
        User searchUser = userService.findById(userId);
        if(searchUser == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }

        searchUser.setRole("WITHDRAW_USER");

        User saveUser = userService.saveUser(searchUser);
        if(saveUser == null){
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        } else {
            return ResponseEntity.ok("회원 탈퇴가 정상적으로 완료되었습니다.");
        }

    }

    @PutMapping("/machine/{userId}")
    public ResponseEntity<?> saveMachine (@PathVariable("userId") int userId, @RequestParam("machineId") String machineId){
        User searchUser = userService.findById(userId);
        if(searchUser == null){
            return ResponseEntity.badRequest().body("등록된 유저가 없습니다.");
        }

        searchUser.setMachine(machineId);

        User saveUser = userService.saveUser(searchUser);
        if(saveUser == null){
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        } else {
            return ResponseEntity.ok("기기 등록이 정상적으로 완료되었습니다.");
        }

    }

    @PutMapping("/signup")
    public ResponseEntity<?> signup(@CookieValue("access") String token, @RequestBody UserResponseDto request){

        // 1. Bearer 토큰에서 실제 JWT 값만 추출
        String jwt = token.replace("access", "");

//        System.out.println(jwt);

        // 2. JWT에서 유저 이메일 또는 ID 가져오기
        Integer id = jwtUtil.getId(jwt);

        // 3. DB에서 해당 유저 찾기
        User user = userService.findById(id);

        // 4. 유저 정보 업데이트
        user.setName(request.getName());
        user.setBirthday(request.getBirthday());
        user.setRole("USER");
        userService.saveUser(user);

        return ResponseEntity.ok("회원가입이 정상적으로 완료되었습니다.");
    }

}
