package com.wizbee.backend.socket;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

// RedisTemplate를 사용하여 room: {userId} 키에 roomId 값을 저장하고 조회
@Component
public class RoomManager {

    private final String KEY_PREFIX = "room:";

    private final RedisTemplate<String, String> redisTemplate;

    public RoomManager(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 라즈베리파이 ID와 room ID Redis에 저장
    public void setRoomIdForUser(String raspberryPiId, String roomId ) {
        redisTemplate.opsForValue().set(KEY_PREFIX + raspberryPiId, roomId);
    }

    // 사용자 Id에 해당하는 roomId 조회
    public String getRoomId(String id) {
        return redisTemplate.opsForValue().get(KEY_PREFIX + id);
    }

}
