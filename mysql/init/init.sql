USE wizbee;

-- 테이블 생성 (PK 정의 포함)
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_name` VARCHAR(50) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_email` VARCHAR(100) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_birthday` DATE NULL COMMENT '회원가입 과정에서 추가로 받을 정보',
    `user_role` VARCHAR(20) NOT NULL COMMENT '생년월일 정보를 입력했느냐 안 했느냐 구분 용도',
    `user_machine` VARCHAR(20) NULL COMMENT '유저가 사용하는 라즈베리파이 기기 고유 번호',
    `user_imgurl` TEXT NULL COMMENT '사용자 이미지 URL',
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `timelapse` (
    `timelapse_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL COMMENT 'user테이블 참조',
    `timelapse_url` VARCHAR(255) NOT NULL COMMENT 's3에 저장된 타임랩스 url',
    `timelapse_date` VARCHAR(255) NOT NULL DEFAULT "한국 시간" COMMENT '촬영 시작 시간',
    `timalapse_title` VARCHAR(255) NOT NULL DEFAULT "제목없음" COMMENT '타임랩스 제목',
    PRIMARY KEY (`timelapse_id`)
);

CREATE TABLE `chart` (
    `chart_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL,
    `chart_date` DATE NOT NULL COMMENT '공부 시작 날짜(22시~02시처럼 넘어갈 경우 22시 기준의 날짜 저장)',
    `chart_fulltime` INTEGER NULL DEFAULT 0 COMMENT '전체 총 공부 시간',
    `chart_studytime` INTEGER NULL DEFAULT 0 COMMENT '순공부시간',
    `chart_sleepcnt` INTEGER NULL DEFAULT 0 COMMENT '졸거나 잠든 횟수',
    `chart_sleeptime` INTEGER NULL DEFAULT 0 COMMENT '졸거나 잠든 시간',
    `chart_phonecnt` INTEGER NULL DEFAULT 0 COMMENT '핸드폰 만진 횟수',
    `chart_phonetime` INTEGER NULL DEFAULT 0 COMMENT '핸드폰 만진 시간',
    `chart_outcnt` INTEGER NULL DEFAULT 0 COMMENT '자리 비운 횟수',
    `chart_outtime` INTEGER NULL DEFAULT 0 COMMENT '자리 비운 시간',
    PRIMARY KEY (`chart_id`)
);

CREATE TABLE `pose` (
    `pose_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_id2` INTEGER NOT NULL COMMENT 'user_id FK',
    `pose_turtlecnt` INTEGER NULL DEFAULT 0 COMMENT '거북목 된 횟수',
    `pose_shouldercnt` INTEGER NULL DEFAULT 0 COMMENT '어깨 틀어짐 횟수',
    `pose_downcnt` INTEGER NULL DEFAULT 0 COMMENT '엎드림 횟수',
    `pose_date` DATE NOT NULL COMMENT '그날 날짜',
    PRIMARY KEY (`pose_id`)
);

CREATE TABLE `poseimage` (
    `poseimage_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL COMMENT 'user_id FK',
    `pose_id` INTEGER NOT NULL COMMENT 'pose_id FK',
    `poseimage_url` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`poseimage_id`)
);

-- 외래키 제약 조건 추가 (ALTER TABLE로 정의)
ALTER TABLE `timelapse`
ADD CONSTRAINT `FK_users_TO_timelapse_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `chart`
ADD CONSTRAINT `FK_users_TO_chart_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `pose`
ADD CONSTRAINT `FK_users_TO_pose_1` FOREIGN KEY (`user_id2`) REFERENCES `users` (`user_id`);

ALTER TABLE `poseimage`
ADD CONSTRAINT `FK_users_TO_poseimage_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `poseimage`
ADD CONSTRAINT `FK_pose_TO_poseimage_1` FOREIGN KEY (`pose_id`) REFERENCES `pose` (`pose_id`);

-- 데이터 삽입
INSERT INTO
    `users` (
        `user_name`,
        `user_email`,
        `user_birthday`,
        `user_role`,
        `user_machine`,
        `user_imgurl`
    )
VALUES (
        '김싸피',
        'wizbee@example.com',
        '2011-11-11',
        'USER',
        'RASPI-2023-001',
        'example.png'
    );

INSERT INTO
    `users` (
        `user_name`,
        `user_email`,
        `user_role`
    )
VALUES (
        '이싸피',
        'eebziw@example.com',
        'NO_BIRTH_USER'
    );

-- 타임랩스 테이블 더미데이터 삽입 (user_id 16: 4개, 17: 6개)
INSERT INTO
    `timelapse` (
        `user_id`,
        `timelapse_url`,
        `timelapse_date`,
        `timelapse_title`
    )
VALUES (
        16,
        'https://s3.amazonaws.com/timelapses/user16/city_night.mp4',
        '2025-03-25 22:15:00',
        '도시의 밤'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/flower_blooming.mp4',
        '2025-03-26 14:20:00',
        '꽃 피는 과정'
    ),
    (
        16,
        'https://s3.amazonaws.com/timelapses/user16/traffic_rush_hour.mp4',
        '2025-03-27 17:30:00',
        '출퇴근 시간 교통'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/cooking_process.mp4',
        '2025-03-28 19:45:00',
        '요리 과정'
    ),
    (
        16,
        'https://s3.amazonaws.com/timelapses/user16/cloud_timelapse.mp4',
        '2025-03-29 13:10:00',
        '구름 형성 과정'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/plant_growing.mp4',
        '2025-03-30 08:15:00',
        '식물 성장 과정'
    ),
    (
        16,
        'https://s3.amazonaws.com/timelapses/user16/sunset_view.mp4',
        '2025-03-31 18:30:00',
        '황혼 풍경'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/market_day.mp4',
        '2025-04-01 10:20:00',
        '시장 하루'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/ocean_waves.mp4',
        '2025-04-01 15:40:00',
        '바다 파도'
    ),
    (
        17,
        'https://s3.amazonaws.com/timelapses/user17/stars_movement.mp4',
        '2025-04-01 23:50:00',
        '별의 움직임'
    );