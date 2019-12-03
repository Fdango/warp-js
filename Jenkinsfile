pipeline {
    agent { label "slave" }
    environment{
        branchName = sh(
            script: "echo ${env.GIT_BRANCH} | sed -e 's|/|-|g'",
            returnStdout: true
        ).trim()
        dockerTag="${env.branchName}-${env.BUILD_NUMBER}"
        dockerImage="${env.CONTAINER_IMAGE}:${env.dockerTag}"
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
                withCredentials([usernamePassword(credentialsId: 'devopsautomate', passwordVariable: 'gitlabPassword', usernameVariable: 'gitlabUsername')]) {
                    sh '''
                        echo "Build Image"
                        docker build --pull -t ${dockerImage} -f docker/Dockerfile .
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                sh '''
                    echo "Run lint -> ${dockerImage}"
                    docker run --rm ${dockerImage} sh -c "make lint"
                '''
            }
        }

        stage('Unit Test') {
            steps {
                sh '''
                    echo "Run unit test -> ${dockerImage}"
                    docker run --rm ${dockerImage} sh -c "make test-coverage"
                '''
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                sh '''
                    echo "SonarQube Code Analysis"              
                '''
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                sh '''
                    echo "SonarQube Quality Gate"    
                '''
            }
        }
    }
    post {
            always {
            sh '''
               docker image rm -f ${dockerImage}
            '''
                deleteDir()
            }
    }
}
