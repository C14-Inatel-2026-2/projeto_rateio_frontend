pipeline {
  agent any
  tools { nodejs 'node20' }
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
        archiveArtifacts artifacts: '.next/**', excludes: '.next/cache/**', fingerprint: true
      }
    }

  }
  post {
    always { cleanWs() }
  }
}
