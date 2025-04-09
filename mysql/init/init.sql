USE wizbee;
-- 포맷팅 금지!!!
-- 주의! 유저가 7번 유저 이상인 경우에만 inesert문을 실행시킬 것

-- 테이블 생성 (PK 정의 포함)
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_name` VARCHAR(50) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_email` VARCHAR(100) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_birthday` DATE NULL COMMENT '회원가입 과정에서 추가로 받을 정보',
    `user_role` VARCHAR(20) NOT NULL COMMENT '생년월일 정보를 입력했느냐 안 했느냐 구분 용도',
    `user_machine` VARCHAR(20) NULL COMMENT '유저가 사용하는 라즈베리파이 기기 고유 번호',
    `user_imgurl` TEXT NULL COMMENT '사용자 이미지 URL',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `UK_user_email` (`user_email`),
    UNIQUE KEY `UK_user_machine` (`user_machine`)
);

CREATE TABLE `timelapse` (
    `timelapse_id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL COMMENT 'user테이블 참조',
    `timelapse_url` VARCHAR(255) NULL COMMENT 's3에 저장된 타임랩스 url',
    `timelapse_date` VARCHAR(255) NOT NULL DEFAULT "한국 시간" COMMENT '촬영 시작 시간',
    `timelapse_title` VARCHAR(255) NOT NULL DEFAULT "제목없음" COMMENT '타임랩스 제목',
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
    `user_id` INTEGER NOT NULL COMMENT 'user_id FK',
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
ADD CONSTRAINT `FK_users_TO_pose_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `poseimage`
ADD CONSTRAINT `FK_users_TO_poseimage_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `poseimage`
ADD CONSTRAINT `FK_pose_TO_poseimage_1` FOREIGN KEY (`pose_id`) REFERENCES `pose` (`pose_id`);

-- 사용자 데이터 삽입
INSERT INTO `users` (`user_name`, `user_email`, `user_role`) VALUES 
('권동환', 'enderstream00@gmail.com', 'NO_BIRTH_USER'),
('권동환', 'kwondhl9@gmail.com', 'NO_BIRTH_USER'),
('이싸피', 'eebziw@example.com', 'NO_BIRTH_USER');

-- 추가 정보가 있는 사용자 삽입
INSERT INTO `users` (`user_name`, `user_email`, `user_birthday`, `user_role`, `user_machine`, `user_imgurl`) VALUES 
('김싸피', 'wizbee@example.com', '2011-11-11', 'USER', '03', 'example.png');

-- 타임랩스 테이블 더미데이터 삽입
INSERT INTO `timelapse` (`user_id`, `timelapse_url`, `timelapse_date`, `timelapse_title`) VALUES 
-- User 1
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 2
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 3
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 4
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(4, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 5
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(5, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 6
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(6, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경'),
-- User 7
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-25 22:15:00', '도시의 밤'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-26 14:20:00', '꽃 피는 과정'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-27 17:30:00', '출퇴근 시간 교통'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-28 19:45:00', '요리 과정'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl1.mp4', '2025-03-29 13:10:00', '구름 형성 과정'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl3.mp4', '2025-03-30 08:15:00', '식물 성장 과정'),
(7, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/tl2.mp4', '2025-03-31 18:30:00', '황혼 풍경');


-- 차트 데이터 삽입
INSERT INTO `chart` (`user_id`, `chart_date`, `chart_fulltime`, `chart_studytime`, `chart_sleepcnt`, `chart_sleeptime`, `chart_phonecnt`, `chart_phonetime`, `chart_outcnt`, `chart_outtime`) VALUES 
-- User 1
(1, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(1, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(1, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(1, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(1, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(1, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(1, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(1, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(1, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(1, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(1, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 2
(2, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(2, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(2, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(2, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(2, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(2, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(2, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(2, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(2, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(2, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(2, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 3
(3, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(3, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(3, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(3, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(3, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(3, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(3, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(3, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(3, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(3, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(3, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 4
(4, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(4, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(4, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(4, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(4, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(4, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(4, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(4, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(4, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(4, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(4, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 5
(5, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(5, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(5, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(5, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(5, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(5, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(5, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(5, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(5, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(5, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(5, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 6
(6, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(6, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(6, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(6, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(6, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(6, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(6, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(6, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(6, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(6, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(6, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63),
-- User 7
(7, '2025-03-31', 500, 300, 2, 40, 3, 120, 1, 40),
(7, '2025-04-02', 500, 360, 1, 120, 1, 20, 0, 0),
(7, '2025-04-03', 500, 180, 1, 20, 1, 210, 1, 90),
(7, '2025-04-04', 500, 270, 1, 20, 1, 10, 1, 30),
(7, '2025-04-05', 700, 600, 1, 20, 1, 10, 1, 30),
(7, '2025-04-06', 500, 490, 1, 20, 1, 10, 1, 30),
(7, '2025-04-07', 500, 200, 1, 20, 1, 10, 1, 30),
(7, '2025-04-08', 620, 350, 1, 50, 1, 100, 2, 120),
(7, '2025-04-09', 720, 480, 1, 20, 5, 200, 1, 20),
(7, '2025-04-10', 360, 165, 0, 0, 2, 135, 2, 60),
(7, '2025-04-11', 420, 320, 1, 27, 1, 10, 1, 63);



-- 자세 데이터 삽입
INSERT INTO `pose` (`user_id`, `pose_turtlecnt`, `pose_shouldercnt`, `pose_downcnt`, `pose_date`) VALUES 
-- User 1
(1, 3, 3, 1, '2025-04-09'),
(1, 3, 3, 1, '2025-04-10'),
(1, 3, 3, 1, '2025-04-11'),
-- User 2
(2, 3, 3, 1, '2025-04-09'),
(2, 3, 3, 1, '2025-04-10'),
(2, 3, 3, 1, '2025-04-11'),
-- User 3
(3, 3, 3, 1, '2025-04-09'),
(3, 3, 3, 1, '2025-04-10'),
(3, 3, 3, 1, '2025-04-11'),
-- User 4
(4, 3, 3, 1, '2025-04-09'),
(4, 3, 3, 1, '2025-04-10'),
(4, 3, 3, 1, '2025-04-11'),
-- User 5
(5, 3, 3, 1, '2025-04-09'),
(5, 3, 3, 1, '2025-04-10'),
(5, 3, 3, 1, '2025-04-11'),
-- User 6
(6, 3, 3, 1, '2025-04-09'),
(6, 3, 3, 1, '2025-04-10'),
(6, 3, 3, 1, '2025-04-11'),
-- User 7
(7, 3, 3, 1, '2025-04-09'),
(7, 3, 3, 1, '2025-04-10'),
(7, 3, 3, 1, '2025-04-11');



-- pose_id = 1, 2, 3에 대한 이미지 데이터
INSERT INTO `poseimage` (`user_id`, `pose_id`, `poseimage_url`) VALUES 
-- User 1
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(1, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(1, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(1, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
-- User 2
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(2, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(2, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(2, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
-- User 3
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(3, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(3, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(3, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
-- User 4
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(4, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(4, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(4, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
-- User 5
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(5, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(5, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(5, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
-- User 6
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(6, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(6, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(6, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
-- User 7
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(7, 1, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(7, 2, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_01.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_02.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_03.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_04.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_05.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064_06.jpg'),
(7, 3, 'https://desktests3.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20250402_145337064.jpg');