FROM node:22

WORKDIR /frontend

COPY package*.json ./

RUN npm cache clean --force && \
    npm install

COPY . .

# 빌드 실행
RUN npm run build

# 글로벌에 serve 설치
RUN npm install -g serve

# 15173 포트 노출
EXPOSE 15173

# 빌드된 dist 폴더를 15173 포트로 서빙
CMD ["serve", "-s", "dist", "-l", "15173", "--host", "0.0.0.0"]