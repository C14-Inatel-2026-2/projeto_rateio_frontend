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

        stage('Deploy - Vercel') {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main'
                }
            }

            environment {
                VERCEL_ORG_ID     = credentials('vercel-org-id')
                VERCEL_PROJECT_ID = credentials('vercel-project-id')
            }

            steps {
                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN' )]) {
                    sh '''
                        npx vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
                        npx vercel build --prod --token="$VERCEL_TOKEN"
                        npx vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN" --yes
                    '''
                    
                }
            }
        }
    }
}
