pipeline {
    agent any 

    environment {
        DOCKER_IMAGE = "xhub50n/portfolio-app"
        DOCKER_TAG = "0.${BUILD_NUMBER}.0"
        DOCKER_REGISTRY = 'registry.hub.docker.com' 
    }

    stages {
        stage('Analyze code with SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonarcube-server' 

                    withSonarQubeEnv('sonarqube-server') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                            dir('./app') {
                                sh """
                                    ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=test-sonar \
                                    -Dsonar.sources=. \
                                    -Dsonar.login=${SONAR_TOKEN}  
                                """
                            }
                        }
                    }
                }
            }
        }
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
                    sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
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