pipeline {
    agent any 

    environment {
        DOCKER_IMAGE = "xhub50n/portfolio-app"
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY = 'registry.hub.docker.com' 
    }

    stages {
        stage('Building and pushing container image') {
            agent any
            // when {
            //     allOf {
            //         expression {
            //             currentBuild.result == null || currentBuild.result == 'SUCCESS'  
            //         }
            //     }
            // }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                           usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', 
                                           passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                                dir("react-app"){
                                    sh """
                                        echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                                    """
                        }
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
                        EOF
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