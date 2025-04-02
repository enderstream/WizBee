package com.wizbee.backend.socket.handler;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.wizbee.backend.socket.RoomManager;
import com.wizbee.backend.socket.dto.VideoStreamData;
import com.wizbee.backend.socket.service.SocketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SocketHandler {

    private final SocketIOServer socketIOServer;
    private final SocketService socketService;

    @Autowired
    public SocketHandler(SocketIOServer socketIOServer,
                         SocketService socketService) {
        this.socketIOServer = socketIOServer;
        this.socketService = socketService;

        // 소켓 연결 시 이벤트 리스너
        socketIOServer.addConnectListener(client -> {
            // URL 파리미터에서 userID와 type을 추출 (raspberry 또는 client)
            String id = client.getHandshakeData().getSingleUrlParam("id");
            String type = client.getHandshakeData().getSingleUrlParam("type");

            // 라즈베리파이인 경우
            if ("raspberry".equals(type) && id != null) {
                socketService.raspberryConnect(client, id);
            } else if ("client".equalsIgnoreCase(type) && id != null) {
                socketService.reactConnect(client, id);
            }
        });

        // 라즈베리파이로부터 영상 스트림 데이터를 수신 처리
        // 이벤트 이름: videoStream
        socketIOServer.addEventListener("videoStream", VideoStreamData.class, new DataListener<VideoStreamData>() {
            @Override
            public void onData(SocketIOClient client, VideoStreamData data, AckRequest ackSender) throws Exception {
                socketService.VideoStream(client, data);
            }
        });





    }
}
