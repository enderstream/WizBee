pipeline {
    agent any

    environment {
        COMPOSE_FILE = "docker-compose.yml"
    }

    triggers {
        // GitHub webhook이나 Git polling 사용할 경우 적용됨
        // pollSCM('H/2 * * * *') // 예: 2분마다 체크
    }

    options {
        skipDefaultCheckout() // 수동으로 checkout할 예정
    }

    stages {
        stage('Run on release branch') {
            when {
                branch 'release'
            }
            steps {
                dir('/workspace') {
                    echo "🚀 release 브랜치에서 코드 변경 감지됨"

                    checkout scm

                    echo "🛑 기존 컨테이너 종료"
                    sh 'docker-compose down || true'

                    echo "🔁 새 코드로 빌드 및 실행"
                    sh 'docker-compose up --build -d'
                }
            }
        }
    }

    post {
        success {
            echo "✅ 성공적으로 서비스가 재배포되었습니다."
        }
        failure {
            echo "❌ 실패. Jenkins 로그를 확인하세요."
        }
    }
}
