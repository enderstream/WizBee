# 프로젝트 포팅 매뉴얼

## 목차
1. [개요](#1-개요)
2. [시스템 환경](#2-시스템-환경)
3. [빌드 및 배포 가이드](#3-빌드-및-배포-가이드)
4. [리버스 프록시 설정 가이드](#4-리버스-프록시-설정-가이드)
5. [데이터베이스 설정 가이드](#5-데이터베이스-설정-가이드)
6. [서버 가동 및 종료](#6-서버-가동-및-종료)


## 1. 개요
### 1.1 문서 개요
- 작성일: 2025-04-10
- 작성자: [권동환]

### 1.2 프로젝트 개요
- 프로젝트명: [WizBee]
- GitLab 저장소 URL: [[GitLab URL](https://lab.ssafy.com/s12-ai-image-sub1/S12P21B102)]

## 2. 시스템 환경
### 2.1 개발 환경
#### 2.1.1 IDE
- IntelliJ IDEA 23.3.8
- Visual Studio Code 1.99.1

#### 2.1.2 런타임 환경
- JDK 17
- Python 3.10.11
- Node.js 22.14.0
  - npm 11.2.0

#### 2.1.3 빌드 도구
- Gradle 8.12.1
- Vite 6.2.5

### 2.2 서버 환경
#### 2.2.1 인스턴스 및 운영체제 
- AWS EC2
- Ubuntu 20.04.5 LTS
- Debian GNU/Linux 12

#### 2.2.2 서버 기술 스택
- 프론트엔드 서버 : Vite
- 백엔드 서버 : SpringBoot
- 프록시 서버: Nginx
- 컨테이너: Docker
- 데이터베이스: MySQL
- 캐시 서버: Redis
- 임베디드 서버 : mongoose
- 터널 : ngrok

#### 2.2.3 서비스 포트 구성
| 서비스     | 포트 | 기술 스택   |
| ---------- | ---- | ----------- |
| 프론트엔드 | 15173 | Vite        |
| 백엔드     | 18080 | Spring Boot |
| DB(SQL)    | 13306 | MySQL       |
| DB(NOSQL)  | 16379 | Redis       |
| Proxy      | 443  | Nginx       |

#### 2.2.4 MySQL 데이터베이스 접속 정보
> 주의사항 : DB접속 ID, PW는 유추하기 어려운 것으로 설정할 것
- 데이터베이스명: wizbee
- 접속 정보
  ```properties
  spring.datasource.url=${MYSQL_URL}
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  spring.datasource.username=${MYSQL_USER}
  spring.datasource.password=${MYSQL_PASSWORD}
  ```
  ```env
  MYSQL_ROOT_PASSWORD=ROOT_PASSWORD
  MYSQL_DATABASE=wizbee
  MYSQL_USER=USER_NAME
  MYSQL_PASSWORD=USER_PASSWORD
  MYSQL_URL=jdbc:mysql://mysql:13306/wizbee?useSSL=false&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul
  ```

#### 2.2.5 Redis 데이터베이스 접속 정보
- 데이터베이스명: 0
- 접속 정보
  ```properties
  spring.data.redis.host=${SPRING_REDIS_HOST}
  spring.data.redis.port=${SPRING_REDIS_PORT}
  spring.data.redis.password=${SPRING_REDIS_PASSWORD}
  ```

  ```env
  REDIS_HOST=redis
  REDIS_PASSWORD=banguyunju
  ```

#### 2.2.6 환경변수 정보
> 주의사항 : 지정된 디렉토리에 환경변수가 올바르게 존재하지 않을 경우 실행되지 않으며, URL을 호스팅할 서버의 도메인으로 대체할 것
- 프로젝트 루트 디렉토리 : `S12P11B212` 
- 환경변수 명세
  - 프론트엔드 서버 환경변수 : `S12P11B212/FE/.env`
     ```env
      VITE_API_URL=https://j12b102.p.ssafy.io
      VITE_SOCKET_URL=https://j12b102.p.ssafy.io
      VITE_HMR_HOST=j12b102.p.ssafy.io
      VITE_HMR_ENABLED=false
     ```
  - 백엔드 서버 환경변수 : `S12P11B212/BE/undaid/src/main/resources/application.properties`
     ```properties
      # Application
      spring.application.name=backend

      # 환경 변수 가져오기
      spring.config.import=optional:file:.env[.properties]

      FRONTEND_URL=${FRONTEND_URL}

      # 서버 설정
      server.forward-headers-strategy=native

      # Google OAuth2 로그인 설정
      spring.security.oauth2.client.registration.google.client-name=google
      spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
      spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
      spring.security.oauth2.client.registration.google.redirect-uri=${GOOGLE_REDIRECT_URI}
      spring.security.oauth2.client.registration.google.authorization-grant-type=authorization_code
      spring.security.oauth2.client.registration.google.scope=profile,email

      # JWT 설정
      spring.jwt.secret=${JWT_SECRET}

      # 데이터베이스 설정
      spring.datasource.url=${MYSQL_URL}
      spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
      spring.datasource.username=${MYSQL_USER}
      spring.datasource.password=${MYSQL_PASSWORD}

      spring.mvc.throw-exception-if-no-handler-found=true
      spring.web.resources.add-mappings=false

      # JPA 설정
      spring.jpa.show-sql=true
      spring.jpa.hibernate.ddl-auto=none
      spring.jpa.properties.hibernate.format_sql=true
      spring.jpa.properties.hibernate.highlight_sql=true
      spring.jpa.open-in-view=false

      # Redis 설정
      spring.data.redis.host=${SPRING_REDIS_HOST}
      spring.data.redis.port=${SPRING_REDIS_PORT}
      spring.data.redis.password=${SPRING_REDIS_PASSWORD}
      spring.data.redis.database=0
      spring.data.redis.timeout=5000
      spring.data.redis.lettuce.pool.max-active=8
      spring.data.redis.lettuce.pool.max-idle=8
      spring.data.redis.lettuce.pool.min-idle=5
      spring.data.redis.lettuce.pool.max-wait=-1ms
      spring.data.redis.lettuce.pool.time-between-eviction-runs=60000
      spring.data.redis.lettuce.shutdown-timeout=1000ms

      # 서버 인코딩 설정
      server.servlet.encoding.charset=UTF-8
      server.servlet.encoding.force=true

      # 로깅 설정
      logging.level.root=INFO
      logging.level.org.springframework.security=DEBUG

      # Redis & WebSocket 디버그 로깅
      logging.level.org.springframework.data.redis=TRACE
     ``` 

  - 프로젝트 환경변수 : `S12P11B212/.env`
     ```env
      # 프로젝트 이름
      COMPOSE_PROJECT_NAME=wizbee

      # 프론트엔드 URL
      FRONTEND_URL=https://j12b102.p.ssafy.io

      # 라즈베리 파이 URL
      RASPBERRY_PI_URL=https://reliant-locust-5560.dataplicity.io

      # 포트 설정
      FRONTEND_PORT=15173
      BACKEND_PORT=18080
      MYSQL_PORT=13306
      REDIS_PORT=16379

      # MySQL 설정
      MYSQL_ROOT_PASSWORD=ROOT_PASSWORD
      MYSQL_DATABASE=wizbee
      MYSQL_USER=USER_NAME
      MYSQL_PASSWORD=USER_PASSWORD
      MYSQL_URL=jdbc:mysql://mysql:13306/wizbee?useSSL=false&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul

      # Redis 설정
      REDIS_HOST=redis
      REDIS_PASSWORD=REDIS_PASSWORD

      # Google OAuth2 설정
      GOOGLE_CLIENT_ID=622186014503-5eb0ut2fa6sv4opbh0il4ude814m1rt6.apps.googleusercontent.com
      GOOGLE_CLIENT_SECRET=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
      GOOGLE_REDIRECT_URI=https://j12b102.p.ssafy.io/login/oauth2/code/google

      # JWT 비밀 키
      JWT_SECRET=INPUT_YOUR_JWT_SECRET

      # 시스템 설정
      TIMEZONE=Asia/Seoul
      NOFILE_SOFT_LIMIT=65536
      NOFILE_HARD_LIMIT=65536

      # 리소스 제한
      BACKEND_MEMORY_LIMIT=1G
      BACKEND_MEMORY_RESERVATION=512M

      # 프론트엔드 환경 변수
      VITE_API_URL=https://j12b102.p.ssafy.io
      VITE_SOCKET_URL=https://j12b102.p.ssafy.io
      VITE_HMR_HOST=j12b102.p.ssafy.io
      VITE_HMR_ENABLED=false
     ```


## 3. 빌드 및 배포 가이드
> 주의사항 : 프로젝트를 새로 클론받았을 경우, docker-compose.override.yml은 아래 내용을 참고하여 직접 수동으로 작성해야하며, docker network 역시 수동으로 생성해야한다. 그 외의 내용들은 이미 작성되어있다.
### 3.1 업데이트 패키지 확인 및 설치
```bash
$ sudo apt update && sudo apt upgrade -y
```

### 3.2 도커 설치
#### 3.2.1 필요한 패키지 설치
```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

#### 3.2.2 Docker 공식 GPG 키를 추가
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

#### 3.2.3 Docker 저장소 추가
```bash
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

#### 3.2.4 패키지 목록 재업데이트 
```bash
sudo apt update && sudo apt upgrade -y
```

#### 3.2.5 Docker 설치
```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

#### 3.2.6 도커 설치 확인
```bash
$ docker --version 
# 설치 성공시 "Docker version 27.5.1, build 9f9e405"등이 출력됨
```

#### 3.2.7 현재 사용자를 docker 그룹에 추가하여 sudo 없이 Docker를 실행할 수 있게 설정
> 주의사항 : 이 설정을 적용하려면 로그아웃했다가, 다시 로그인해야함
```bash
sudo usermod -aG docker $USER
```

#### 3.2.8 Docker Compose 설치
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

#### 3.2.9 Docker Compose에 실행 권한 부여
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3.2.10 Docker Compose 설치 확인
```bash
sudo chmod +x /usr/local/bin/docker-compose
# 설치 성공시 "Docker Compose version v2.32.4" 등이 출력됨
```

#### 3.2.11 Docker Compose에 실행권한 부여
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

### 3.3 방화벽 포트 허용
#### 3.3.1 아래 명령어를 실행하여, 도커 컨테이너 통신을 위한 포트를 방화벽에서 허용한다
```bash
sudo ufw allow 80,443,18080,15173,13306,16379/tcp
``` 

#### 3.3.2 방화벽에서 허용된 포트들 확인하기
```bash
$ sudo ufw status numbered
```

#### 3.3.3 허용된 포트들을 적용하기(방화벽 활성화)
```bash
$ sudo ufw enable
```

### 3.7 도커 컨테이너 빌드
> 주의사항 : https 통신을 위해 반드시 nginx 컨테이너를 먼저 실행한다
#### 리버스 프록시 서버로 세팅된 nginx 컨테이너는 docker-compose.nginx.yml로 빌드된다. 아래 명령어를 실행하여 nginx 컨테이너를 빌드, 실행한다.
```bash
$ docker-compose -f docker-compose.nginx.yml up --build
```

#### 프론트엔드, 백엔드, AI, MySQL, Redis 컨테이너는 docker-compose.yml로 동시에 빌드된다. 아래 명령어를 실행하여 프론트엔드, 백엔드, AI, MySQL, Redis 컨테이너를 빌드, 실행한다. 이때 docker-compose.override.yml도 빌드, 실행에 적용된다.
```bash
$ docker-compose up --build  # docker-compose.override.yml 내용이 자동으로 오버라이드됨
```

#### docker-compose.override.yml의 역할
  > 배포환경에서는 서비스 보안정책에 따라 지정된 포트로만 외부에서 접근 가능해야한다. 따라서 도커 네트워크 안에서만 통신할 수 있게 해주는 expose 옵션으로 컨테이너를 빌드해야한다. 하지만 개발환경에서는 설정, 디버깅, 서버와의 연동 등 다양한 이유로 인해 도커 네트워크 외부에서도 접속을 허용하는 경우가 많아 ports 옵션으로 컨테이너를 빌드할 필요가 있다. docker-compose.override.yml은 환경에 맞춰 포트, 볼륨 등 다양한 컨테이너 설정을 오버라이드 할 수 있어서 하나의 docker-compose.yml을 가지고 다양한 환경에서 커스텀할 수 있는 장점이 있다.


## 4. 리버스 프록시 설정 가이드
### 4.1 SSL 인증서 설정
#### 4.1.1 certbot 기본 패키지 설치
```bash
$ sudo apt install certbot
```

#### 4.1.2 Nginx 플러그인 설치
```bash
$ sudo apt install python3-certbot-nginx
```

#### 4.1.3 Certbot으로 SSL/TLS 인증서 발급
```bash
$ sudo certbot -d i12b212.p.ssafy.io
#                  ^ 이 부분은 호스팅할 서버의 도메인으로 교체
# 아래와 같이 뜨면 성공이다
# Congratulations! Your certificate and chain have been saved at:
#   /etc/letsencrypt/live/i12b212.p.ssafy.io/fullchain.pem
#   Your key file has been saved at:
#   /etc/letsencrypt/live/i12b212.p.ssafy.io/privkey.pem 
```

#### 4.1.4 Certbot으로 발급된 SSL/TLS 인증서 목록 확인
```bash
$ sudo certbot certificates
```

### 4.2 nginx 기본 설정
  ```conf
  user nginx;
  worker_processes auto;
  pid /run/nginx.pid;

  events {
      worker_connections 768;
  }

  http {
      sendfile on;
      tcp_nopush on;
      tcp_nodelay on;
      keepalive_timeout 65;
      types_hash_max_size 2048;

      include /etc/nginx/conf.d/blacklist.conf; # 블랙리스트 
      include /etc/nginx/mime.types;
      default_type application/octet-stream;

      # 실제 IP 인식 설정
      real_ip_header X-Real-IP;
      set_real_ip_from 172.16.0.0/12;  # Docker 네트워크 범위
      set_real_ip_from 192.168.0.0/16; # 추가 내부 네트워크 범위
      set_real_ip_from 10.0.0.0/8;     # 추가 내부 네트워크 범위
      
      # 사용자 정의 로그 형식
      log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
      
      access_log /var/log/nginx/access.log main;
      error_log /var/log/nginx/error.log;

      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_prefer_server_ciphers on;

      gzip on;

      include /etc/nginx/conf.d/*.conf;
  }
  ```

### 4.3 nginx 확장 설정
> 주의사항 : server_name 부분을 호스팅할 서버의 도메인으로 대체하고, SSL 설정부분도 인증키의 절대경로를 찾아 대체할 것
  ```conf
  resolver 127.0.0.11 valid=30s;

  # Upstream 설정
  upstream frontend {
      zone frontend 64k;
      server frontend:15173 resolve;
  }

  upstream backend {
      zone backend 64k;
      server backend:18080 resolve;
  }

  upstream jenkins {
      zone jenkins 64k;
      server jenkins:18443 resolve;
  }

  # HTTP server - 보안 우선 처리 및 HTTPS 리다이렉트
  server {
      listen 80;
      server_name j12b102.p.ssafy.io;
      
      # 접근 로깅
      access_log /var/log/nginx/access.log main;
      
      # IP 블랙리스트 체크
      if ($blacklist = 1) {
          return 403;
      }
      
      # 보안 위협 차단 규칙 - HTTP 요청에 대해 먼저 적용
      
      # 숨겨진 파일 및 디렉토리 접근 차단
      location ~ /\. {
          deny all;
          return 403;
      }
      
      # .env 파일 접근 차단
      location ~ \.env$ {
          deny all;
          return 403;
      }
      
      # Git 관련 접근 차단
      location ~ /\.git {
          deny all;
          return 403;
      }
      
      # 민감한 설정 파일 접근 차단
      location ~ \.(config|ini|conf|json|yaml|yml|key|pem|crt|lock|sql|bak|old)$ {
          deny all;
          return 403;
      }
      
      # 소스 코드 및 모듈 접근 차단
      location ~ ^/(src|node_modules|package.json|webpack|composer|gulpfile|gruntfile|Dockerfile) {
          deny all;
          return 403;
      }
      
      # 일반적인 웹 공격 경로 차단
      location ~ ^/(git|config|env|setup|install|wp-admin|wp-content|phpinfo|admin|administrator|wp-login|xmlrpc|cgi-bin|phpmyadmin|mysql|myadmin|pma|sql|db|database) {
          deny all;
          return 403;
      }
      
      # PHP 파일 실행 시도 차단
      location ~ \.(php|phtml|php5|php7)$ {
          deny all;
          return 403;
      }
      
      # 취약한 파일 확장자 접근 차단
      location ~ \.(sh|bash|exe|pl|py|cgi|asp|aspx|jsp)$ {
          deny all;
          return 403;
      }
      
      # 대부분의 HTTP 메소드 차단 (GET, POST, HEAD, PUT만 허용)
      if ($request_method !~ ^(GET|POST|HEAD|PUT|DELETE)$) {
          return 403;
      }
      
      # 그 외 모든 요청은 HTTPS로 리다이렉트
      location / {
          return 301 https://$server_name$request_uri;
      }
  }

  # Main HTTPS server configuration
  server {
      listen 443 ssl;
      server_name j12b102.p.ssafy.io;

      # SSL 설정
      ssl_certificate /etc/letsencrypt/live/j12b102.p.ssafy.io/fullchain.pem; # << 여기랑
      ssl_certificate_key /etc/letsencrypt/live/j12b102.p.ssafy.io/privkey.pem; # << 여기
      include /etc/letsencrypt/options-ssl-nginx.conf;
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

      # IP 블랙리스트 체크
      if ($blacklist = 1) {
          return 403;
      }

      # 접근 로깅 - 차단된 IP도 로깅
      access_log /var/log/nginx/access.log main;

      # 공통 프록시 설정
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port $server_port;

      # 공통 에러 처리
      proxy_intercept_errors on;
      error_page 502 503 504 404 = @maintenance;
      
      # 대부분의 HTTP 메소드 차단 (GET, POST, HEAD, PUT만 허용)
      if ($request_method !~ ^(GET|POST|HEAD|PUT|DELETE)$) {
          return 403;
      }

      # Git 관련 접근 차단
      location ~ /\.git {
          deny all;
          return 403;
      }

      # .env 파일 접근 차단
      location ~ \.env$ {
          deny all;
          return 403;
      }

      # 민감한 설정 파일 접근 차단
      location ~ \.(config|ini|conf|json|yaml|yml|key|pem|crt|lock|sql|bak|old)$ {
          deny all;
          return 403;
      }

      # 숨겨진 파일 및 디렉토리 접근 차단
      location ~ /\. {
          deny all;
          return 403;
      }

      # 소스 코드 및 모듈 접근 차단
      location ~ ^/(src|node_modules|package.json|webpack|composer|gulpfile|gruntfile|Dockerfile) {
          deny all;
          return 403;
      }
      
      # PHP 파일 실행 시도 차단
      location ~ \.(php|phtml|php5|php7)$ {
          deny all;
          return 403;
      }
      
      # 취약한 파일 확장자 접근 차단
      location ~ \.(sh|bash|exe|pl|py|cgi|asp|aspx|jsp)$ {
          deny all;
          return 403;
      }
      
      # 일반적인 웹 공격 경로 차단
      location ~ ^/(git|config|env|setup|install|wp-admin|wp-content|phpinfo|admin|administrator|wp-login|xmlrpc|cgi-bin|phpmyadmin|mysql|myadmin|pma|sql|db|database) {
          deny all;
          return 403;
      }

      # Frontend - 수정된 부분
      location / {
          # 단순히 프론트엔드로 모든 요청을 프록시
          proxy_pass http://frontend;
          
          # 에러 발생 시 maintenance 페이지로 리다이렉션
          proxy_intercept_errors on;
          
          # 미디어 장치 접근을 위한 헤더 추가
          add_header Permissions-Policy "camera=(), microphone=()";
          add_header Feature-Policy "camera 'self'; microphone 'self'";
          
          # 캐시 제어 헤더
          add_header Cache-Control "no-cache, no-store, must-revalidate";
          
          # 타임아웃 설정 증가
          proxy_read_timeout 300s;
          proxy_connect_timeout 300s;
          proxy_send_timeout 300s;
      }

      # Backend API
      location /api/ {
          proxy_pass http://backend/api/;
          
          # 에러 발생 시 maintenance 페이지로 리다이렉션
          proxy_intercept_errors on;
      }

      # API 구현 및 설정에 따라 달라짐
    # 구글 OAuth 인증 경로만 정확히 허용
      location = /oauth2/authorization/google {
          proxy_pass http://backend/oauth2/authorization/google;
          proxy_intercept_errors on;
      }

      # OAuth2 콜백 URL 허용 (application.properties에 설정된 값)
      location = /login/oauth2/code/google {
          proxy_pass http://backend/login/oauth2/code/google;
          proxy_intercept_errors on;
      }

      # 그 외 모든 /oauth2/ 경로는 차단
      location ^~ /oauth2/ {
          deny all;
          return 403;
      }

      # 그 외 모든 /login/ 경로는 차단
      location ^~ /login/ {
          deny all;
          return 403;
      }

      # Jenkins
      location /jenkins {
          proxy_pass http://jenkins/jenkins;
          proxy_read_timeout 90s;
          
          # Jenkins 필수 설정
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          proxy_redirect http:// https://;
          
          # 에러 발생 시 maintenance 페이지로 리다이렉션
          proxy_intercept_errors on;
      }

      # Maintenance page
      location @maintenance {
          root /usr/share/nginx/html;
          internal;
          default_type text/html;
          
          # maintenance.html 파일을 표시하고, 없으면 503 상태 코드 반환
          try_files /maintenance.html =503;
          
          # 503 상태 코드를 명시적으로 설정
          return 503;
      }
  }
  ```

## 5. 데이터베이스 설정 가이드
### 5.1 MySQL 접속 방법
#### 5.1.1 MySQL 쉘로 컨테이너에 접속
```bash
$ docker exec -it mysql mysql -u YOUR_DB_ID -p
# docker exec -it 컨테이너명 쉘 -u 사용자 -p
```

#### 5.1.2 비밀번호를 요구하므로 환경변수로 설정해둔 비밀번호를 입력한다
> 주의사항: 비밀번호는 입력과정이 보이지 않는다.
```mysql
>  # 여기에 비밀번호를 입력
```

#### 5.1.3 mysql/init/init.sql에 작성된 초기쿼리문을 실행한다

## 6. 서버 가동 및 종료
### 6.1 서버 가동
> 3~5 의 모든 과정을 빠짐없이, 성공적으로 마쳤다면 이미 컨테이너가 실행되서 서버가 열린 상태일 것이다.   
> 만약 서버를 켜고 싶다면 터미널상에서 프로젝트 루트 디렉토리로 이동한 후 아래 명령어를 입력하면 된다
> ```bash
> $ docker-compose up
> ```
> 만약 소스코드의 변동사항이 있다면, 다시 빌드한 뒤 서버를 가동하면 된다
> ```bash
> $ docker-compose up --build
> ```

### 6.2 서버 종료
> `docker-compose up` 명령어는 기본적으로 attatch모드에서 실행되므로 이 상태에서 서버를 종료하고 싶다면 ^C를 입력해주면 된다  
> 만약 다른 터미널에서 혹은 detatch모드로 실행중인 서버를 종료하고 싶을 경우, 아래 명령어로 종료할 수 있다.  
> ```bash
> $ docker-compose down
> ```

