/* groovylint-disable LineLength */
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm i --ws'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            // set env
            environment {
                RSSHUB_TEST = 'true'
            }
            steps {
                sh 'npm test --if-present --ws'
            }
        }

    }

    post {
        always {
            cleanWs()
        }
    }
}
