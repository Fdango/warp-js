pipeline {
    agent { label "slave" }
    environment{
        branchName = sh(
            script: "echo ${env.GIT_BRANCH} | sed -e 's|/|-|g'",
            returnStdout: true
        )
    }
    stages {
        stage ('Cleanup') {
            steps {
                dir('directoryToDelete') {
                    deleteDir()
                }
            }
        }

        stage('Build Image Test') {
            steps {
                sh '''
                    echo "Build Image"
                    docker-compose build --pull
                '''
            }
        }

        stage('NPM run Lint') {
            steps {
                sh '''
                    echo "Run Lint -> ${branchName}"
                    docker-compose up lint
                '''
            }
        }
        stage('NPM run test') {
            steps {
                sh '''
                    echo "Run Test -> ${branchName}"
                    docker-compose up test
                '''
            }
        }
    }
    post {
            always {
                deleteDir()
            }
    }
}
