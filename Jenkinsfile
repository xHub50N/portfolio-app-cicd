pipeline {
    agent any 

    environment {
        DOCKER_IMAGE = "registry.hub.docker.com/xhub50n/portfolio-app"
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
                                    sh 'ls -la'
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