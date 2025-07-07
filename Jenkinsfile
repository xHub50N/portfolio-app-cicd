pipeline {
    agent any 

    environment {
        DOCKER_IMAGE = "xhub50n/portfolio-app"
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY = 'registry.hub.docker.com' 
    }

    stages {
        stage('Building and pushing container image') {
            steps {
                withVault([
                vaultSecrets: [[
                    path: 'secret/docker',
                    secretValues: [
                        [envVar: 'DOCKER_USER', vaultKey: 'username'],
                        [envVar: 'DOCKER_PASS', vaultKey: 'password']
                    ]
                ]]
            ])
                {
                dir("react-app"){
                    sh """
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                    }
                }
            }
        }
        stage('Post-build') {
            steps {
                script {
                    echo 'Build completed!' 
                }
            }
        }
        stage('Deploy') {
            agent any
            steps {
                sshagent(credentials: ['terraform-user']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no terraform@192.168.0.52 <<EOF
                        set -e

                        echo '--- Pull najnowszego obrazu ---'
                        docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}

                        echo '--- Stop & remove starego kontenera (jeśli istnieje) ---'
                        docker stop portfolio || true
                        docker rm   portfolio || true

                        echo '--- Uruchamiam nowy kontener ---'
                        docker run -d --name portfolio \\
                                -p 3000:3000 \\
                                --restart=always \\
                                ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

    }
    
    post {
        success {
            echo 'Pipeline zakończony sukcesem!'
        }
        failure {
            echo 'Pipeline zakończony błędem!' 
        }
    }
}