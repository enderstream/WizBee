package com.wizbee.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("test성공");
    }
}
