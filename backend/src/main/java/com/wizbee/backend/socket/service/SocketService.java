package com.wizbee.backend.socket.service;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.wizbee.backend.socket.RoomManager;
import com.wizbee.backend.socket.dto.VideoStreamData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
public class SocketService {

    private final SocketIOServer socketIOServer;
    private final RoomManager roomManager;

    public SocketService(SocketIOServer socketIOServer, RoomManager roomManager) {
        this.socketIOServer = socketIOServer;
        this.roomManager = roomManager;
    }

    // 라즈베리파이 소켓 연결 및 room 생성 및 참가
    public void raspberryConnect(SocketIOClient client, String id) {
        String roomId = UUID.randomUUID().toString();
        client.joinRoom(roomId);
        client.set("roomId", roomId);
        roomManager.setRoomIdForUser(id, roomId);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
        log.info("라즈베리파이 연결됨 - id: {}, roomId: {}, 시간: {}", id, roomId, now);

    }

    // react 소켓 연결 및 room 참가
    public void reactConnect(SocketIOClient client, String id) {
        String roomId = roomManager.getRoomId(id);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
        if (roomId != null) {
            client.joinRoom(roomId);
            log.info("react 연결됨 - id: {}, roomId: {}, 시간: {}", id, roomId, now);

            // 라즈베리파이에게 videoStream 데이터 보내라고 요청
            socketIOServer.getRoomOperations(roomId)
                          .sendEvent("requestVideoStream",client, "videoStreamStart");
        } else {
            log.warn("클라이언트 연결됨 - id: {}m roomId 없음", id);
        }
    }

    // 라즈베리파이가 보내는 videoStream 데이터 수신시 처리
    // react client에게 videoStream 데이터 보내기
    public void VideoStream(SocketIOClient client, VideoStreamData data) {
        String roomId = client.get("roomId");
        String type = client.getHandshakeData().getSingleUrlParam("type");
        if("raspberry".equalsIgnoreCase(type) && roomId != null) {
            // 발신자 (라즈베리파이 제외하고) room 내의 다른 클라이언트(react)에게 데이터 전송
            socketIOServer.getRoomOperations(roomId)
                          .sendEvent("videoStream", client, data);
            log.info("영상 데이터 전송 - roomId {}", roomId);
        }
    }

    // 촬영 시작을 요청하는 event 보내기
    public void timeLapseStart(String id, int timeLapseId) {
        // Redis에서 id(machine)으로 room 조회
        String roomId = roomManager.getRoomId(id);
        if (roomId == null) {
            throw new RuntimeException("Room not found for id: " + id);
        }

        log.info("촬영 시작 - roomId {}", roomId);
        // 라즈베리파이에 촬영 시작 이벤트 전송
        socketIOServer.getRoomOperations(roomId).sendEvent("recordStart", timeLapseId);
    }

    // 촬영 종료 요청하는 event 보내기
    // 촬영을 종료하는 서비스 로직: 라즈베리파이에게 비디오 스트림을 중지하라고 명령
    public void timeLapseEnd(String id) {
        // Redis에서 id(machine)으로 room 조회
        String roomId = roomManager.getRoomId(id);
        if (roomId == null) {
            throw new RuntimeException("Room not found for id: " + id);
        }
        log.info("촬영 종료 - roomId {}", roomId);
        // 라즈베리파이에 촬영 종료 이벤트 전송
        socketIOServer.getRoomOperations(roomId).sendEvent("recordEnd", "timeLapseRecordEnd");
    }

}
