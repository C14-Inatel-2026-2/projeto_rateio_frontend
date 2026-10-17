pipeline {
    agent any
    tools { nodejs 'node20' }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Testes e Cobertura - Front-End') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit.xml'
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Relatorio de Cobertura Front-End'
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: '.next/**', excludes: '.next/cache/**', fingerprint: true
            }
        }
    }
}
