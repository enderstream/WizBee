package com.wizbee.backend.socket.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VideoStreamData {
    private byte[] data;  // 영상 프레임의 바이너리 데이터

}
