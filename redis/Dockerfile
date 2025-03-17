FROM redis:alpine

# 타임존 설정
ENV TZ=Asia/Seoul

# 프로젝트 디렉토리 통째로 복사
COPY . /redis/

# 메모리 제한
LABEL org.opencontainers.image.resources.memory.limit=256M

# 컨테이너 실행
CMD redis-server /redis/redis.conf --port 16379