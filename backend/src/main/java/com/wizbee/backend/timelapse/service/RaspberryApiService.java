package com.wizbee.backend.timelapse.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
@Slf4j
public class RaspberryApiService {

    private final WebClient webClient;

    public RaspberryApiService(WebClient webClient) {
        this.webClient = webClient;
    }

    /*
    라즈베리파이 서버에 촬영 시작 요청 보내기
    타임랩스 ID 전달, post 요청
     */
    public Mono<Void> sendStartTimeLapseRequest(int timeLapseId) {
        return webClient.post()
                // URL 경로에 path variable로 timeLapseId를 포함하여 요청 (라파에서 timelapseid를 알고있어야해서)
                .uri("/api/v1/start-timelapse/{timelapseId}", timeLapseId)
                // HTTP 응답을 받기 시작합니다.
                .retrieve()
                // 상태 코드가 에러인 경우를 람다 표현식을 사용해 처리합니다.
                // HttpStatusCode를 받아 isError()를 호출하여 에러 여부를 판단합니다.
                .onStatus((HttpStatusCode status) -> status.isError(), clientResponse -> {
                    // 응답 본문에서 에러 메시지를 읽은 후, 예외로 변환합니다.
                    return clientResponse.bodyToMono(String.class)
                            .flatMap(errorMessage ->
                                    Mono.error(new RuntimeException("Request failed: " + errorMessage))
                            );
                })
                // 응답 본문이 없으므로, Void 타입으로 변환합니다.
                .bodyToMono(Void.class)
                // 요청이 성공하면 로그에 성공 메시지를 기록합니다.
                .doOnSuccess(v -> log.info("촬영 시작 요청 성공 - timeLapseId: {}", timeLapseId))
                // 요청이 실패하면 로그에 에러 메시지를 기록합니다.
                .doOnError(error -> log.error("촬영 시작 요청 에러 - timeLapseId: {}", timeLapseId, error));
    }
    /*
    react -> spring으로 비디오 스트림 요청을 보내면
    spring -> 라파에 비디오 스트림 요청을 보내고 데이터 받아오기
     */
//    public Flux<DataBuffer> getVideoStream() {
//        return webClient.get()
//                .uri("/api/v1/videostream")
//                .header(HttpHeaders.ACCEPT, "multipart/x-mixed-replace; boundary=frame")
//                .retrieve()
//                .onStatus((HttpStatusCode status) -> status.isError(), clientResponse -> {
//                    // 에러 응답이 있으면 에러로 변환
//                    return clientResponse.bodyToMono(String.class)
//                            .flatMap(errorMessage ->
//                                    Mono.error(new RuntimeException("Stream request failed: " + errorMessage))
//                            );
//
//                })
//                .bodyToFlux(DataBuffer.class)
//                .doOnSubscribe(sub -> log.info("비디오스트림 요청 시작"))
//                .doOnNext(dataBuffer -> log.info("전달된 데이터 청크 크기: {}", dataBuffer.readableByteCount()))
//                .doOnError(error -> log.error("비디오 스트림 요청 에러", error));
//    }


    /*
    react -> spring 촬영 종료 요청 보내면
    spring -> 라파에 촬영 종료 요청 보내기(post 요청)
     */

    public Mono<Void> sendFinishTimeLapseRequest(int timelapseId) {
        return webClient.post()
                .uri("/api/v1/finish-timelapse/{timelapseId}", timelapseId)
                .retrieve()
                .onStatus((HttpStatusCode status) -> status.isError(), clientResponse -> {
                    // 응답 본문에서 에러 메시지를 읽은 후, 예외로 변환합니다.
                    return clientResponse.bodyToMono(String.class)
                            .flatMap(errorMessage ->
                                    Mono.error(new RuntimeException("Request failed: " + errorMessage))
                            );
                })
                .bodyToMono(Void.class)
                .doOnSuccess(v -> log.info("촬영 시작 요청 성공 - timeLapseId: {}", timelapseId))
                .doOnError(error -> log.error("촬영 시작 요청 에러 - timeLapseId: {}", timelapseId, error));

    }
}

