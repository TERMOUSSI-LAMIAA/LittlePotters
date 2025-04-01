pipeline {
    agent any

    environment {
        JAVA_HOME = tool 'JDK-8'   
        MAVEN_HOME = "C:\\all\\java YC\\apache-maven-3.9.9"
        NODE_HOME = "C:\\Program Files\\nodejs"  
        PATH = "${MAVEN_HOME}\\bin;${JAVA_HOME}\\bin;${NODE_HOME};${env.PATH}"
    }

    stages {
        stage('Checkout Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/TERMOUSSI-LAMIAA/LittlePotters.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('littlepotters/backend/littlepotters') {  
                    bat 'mvn clean install' 
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('littlepotters/backend/littlepotters') {
                    bat 'mvn test'  
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('littlepotters/frontend/littlePotters') { 
                    bat 'npm install'  
                    bat 'ng build --configuration=production'  
                }
            }
        }


        stage('Create Docker Images') {
            steps {
                script {
                    bat 'docker build -t backend-image ./backend'  
                    bat 'docker build -t frontend-image ./frontend'  
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                script {
                    bat 'docker-compose up -d'  
                }
            }
        }
    }
}
