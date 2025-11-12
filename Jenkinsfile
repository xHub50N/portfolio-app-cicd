pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "xhub50n/portfolio-app"
        DOCKER_REGISTRY = 'registry.hub.docker.com' 
        N8N_WEBHOOK = "https://n8n.xhub50n.lat/webhook/jenkins-complete"
        WEBHOOK_SECRET = credentials('JENKINS_TO_N8N_SECRET')
    }

    stages {
        stage('Prepare Tag') {
            steps {
                script {
                    def commitHash = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    def buildDate  = sh(script: "date +%Y%m%d%H%M%S", returnStdout: true).trim()
                    env.DOCKER_TAG = "${buildDate}-${commitHash}"
                    echo "Using Docker tag: ${env.DOCKER_TAG}"
                }
            }
        }
        stage('Check Commit Author') {
            steps {
                script {
                    def author = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    if (author.contains("argocd-image-updater")) {
                        echo "Commit from ArgoCD image updater — skipping build"
                        currentBuild.result = 'ABORTED'
                        error("Skipping build due to ArgoCD commit")
                    }
                }
            }
        }

        stage('Checkout Code') {
            agent {
                docker {
                    image 'node:18'
                    args '--network host'
                }
            }
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:18'
                    args '--network host'
                }
            }
            steps {
                dir('./portfolio-app') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:18'
                    args '--network host'
                }
            }
            steps {
                dir('./portfolio-app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Analyze code with SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withCredentials([string(credentialsId: 'sonarqube-token-jenkins', variable: 'SONAR_TOKEN')]) {
                        dir('./portfolio-app') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=portfolio-cicd \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=http://192.168.4.60:9000 \
                                -Dsonar.login=${SONAR_TOKEN}
                            """
                        }
                    }
                }
            }
        }

        stage('Building and pushing container image') {
            steps {
                withVault([
                    vaultSecrets: [[
                        path: 'kv/docker',
                        secretValues: [
                            [envVar: 'DOCKER_USER', vaultKey: 'username'],
                            [envVar: 'DOCKER_PASS', vaultKey: 'password']
                        ]
                    ]]
                ]) {
                    dir("portfolio-app") {
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
                echo 'Build completed!'
            }
        }
    }

    post {
         success {
            script {
            def logText = currentBuild.rawBuild.getLog(50).join("\n") 
            def payload = [
                jobName: env.JOB_NAME,
                buildNumber: env.BUILD_NUMBER,
                status: "SUCCESS",
                logs: logText,
                buildUrl: env.BUILD_URL
            ]
                sh """
                curl -s -X POST ${N8N_WEBHOOK} \
                    -H 'Content-Type: application/json' \
                    -H 'X-Webhook-Secret: ${WEBHOOK_SECRET}' \
                    -d '${groovy.json.JsonOutput.toJson(payload)}'
                """
            }
        }
        aborted {
            script {
            def logText = currentBuild.rawBuild.getLog(50).join("\n") 
            def payload = [
                jobName: env.JOB_NAME,
                buildNumber: env.BUILD_NUMBER,
                status: "ABORTED",
                logs: logText,
                buildUrl: env.BUILD_URL
            ]
                sh """
                    curl -s -X POST ${N8N_WEBHOOK} \
                    -H 'Content-Type: application/json' \
                    -H 'X-Webhook-Secret: ${WEBHOOK_SECRET}' \
                    -d '${groovy.json.JsonOutput.toJson(payload)}'
                """
            }
        }
        failure {
            script {
            def logText = currentBuild.rawBuild.getLog(50).join("\n") 
            def payload = [
                jobName: env.JOB_NAME,
                buildNumber: env.BUILD_NUMBER,
                status: "FAILURE",
                logs: logText,
                buildUrl: env.BUILD_URL
            ]
            sh """
                curl -s -X POST ${N8N_WEBHOOK} \
                -H 'Content-Type: application/json' \
                -H 'X-Webhook-Secret: ${WEBHOOK_SECRET}' \
                -d '${groovy.json.JsonOutput.toJson(payload)}'
            """
            }
        }
    }
}
