package com.wizbee.backend.socket.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Value("${socketio.server.hostname}")
    private String hostname;

    @Value("${socketio.server.port}")
    private int port;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname(hostname);
        config.setPort(port);
        // 클라이언트와의 연결을 유지하ㅣ 위한 ping 간격 및 타임아웃 설정
        config.setPingInterval(25000);
        config.setPingTimeout(60000);
        // 페이로드 크기 최대 1MB
        config.setMaxFramePayloadLength(1048576);

        // 생성한 설정으로 SocketIOServer 객체를 리턴
        return new SocketIOServer(config);
    }


}
