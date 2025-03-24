use wizbee;

CREATE TABLE `timelapse` (
    `timelapse_id` INTEGER NOT NULL COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL COMMENT 'user테이블 참조',
    `timelapse_url` VARCHAR(255) NOT NULL COMMENT 's3에 저장된 타임랩스 url'
);

CREATE TABLE `chart` (
    `chart_id` INTEGER NULL COMMENT 'auto_increment',
    `user_id` INTEGER NOT NULL,
    `chart_date` DATE NOT NULL COMMENT '공부 시작 날짜(22시~02시처럼 넘어갈 경우 22시 기준의 날짜 저장)',
    `chart_fulltime` INTEGER NULL DEFAULT 0 COMMENT '전체 총 공부 시간',
    `chart_studytime` INTEGER NULL DEFAULT 0 COMMENT '순공부시간',
    `chart_sleepcnt` INTEGER NULL DEFAULT 0 COMMENT '졸거나 잠든 횟수',
    `chart_sleeptime` INTEGER NULL DEFAULT 0 COMMENT '졸거나 잠든 시간',
    `chart_phonecnt` INTEGER NULL DEFAULT 0 COMMENT '핸드폰 만진 횟수',
    `chart_phonetime` INTEGER NULL DEFAULT 0 COMMENT '핸드폰 만진 시간',
    `chart_outcnt` INTEGER NULL DEFAULT 0 COMMENT '자리 비운 횟수',
    `chart_outtime` INTEGER NULL DEFAULT 0 COMMENT '자리 비운 시간'
);

CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL COMMENT 'auto_increment',
    `user_name` VARCHAR(50) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_email` VARCHAR(100) NOT NULL COMMENT '구글 소셜로그인으로 받아올 정보',
    `user_birthday` DATE NULL COMMENT '회원가입 과저에서 추가로 받을 정보',
    `user_role` VARCHAR(20) NOT NULL COMMENT '생년월일 정보를 입력했느냐 안 했느냐 구분 용도',
    `user_machine` VARCHAR(20) NULL COMMENT '유저가 사용하는 라즈베리파이 기기 고유 번호'
);

ALTER TABLE `timelapse`
ADD CONSTRAINT `PK_TIMELAPSE` PRIMARY KEY (`timelapse_id`, `user_id`);

ALTER TABLE `chart`
ADD CONSTRAINT `PK_CHART` PRIMARY KEY (`chart_id`, `user_id`);

ALTER TABLE `users`
ADD CONSTRAINT `PK_USERS` PRIMARY KEY (`user_id`);

ALTER TABLE `timelapse`
ADD CONSTRAINT `FK_users_TO_timelapse_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `chart`
ADD CONSTRAINT `FK_users_TO_chart_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

INSERT INTO
    `users` (
        `user_name`,
        `user_email`,
        `user_birthday`,
        `user_role`,
        `user_machine`
    )
VALUES (
        '김싸피',
        'wizbee@example.com',
        '2011-11-11',
        'USER',
        'RASPI-2023-001'
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