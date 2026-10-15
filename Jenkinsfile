pipeline {
  agent any
  tools { nodejs 'node20' }
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
  }
  post {
    always { cleanWs() }
  }
}
