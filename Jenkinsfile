pipeline {
    agent any

    stages {
        stage('Testes e Cobertura - Front-End') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Relatorio de Cobertura Front-End'
                    ])
                }
            }
        }
    }
}