pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        CLUSTER_NAME = 'my-eks-cluster'
        TF_DIR = 'terraform'
        K8S_DIR = 'k8s'
    }
    
    parameters {
        choice(
            name: 'TERRAFORM_ACTION',
            choices: ['apply', 'destroy'],
            description: 'Choose whether to apply or destroy the infrastructure'
        )
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/akashshinde7219/deploy-mern-stack-app.git', branch: 'terraform'
            }
        }

        stage('Terraform Init & Apply - EKS Cluster') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                    dir("${TF_DIR}") {
                        sh 'aws sts get-caller-identity'
                        sh 'terraform init'
                        sh 'terraform plan '
                        script {
                            if (params.TERRAFORM_ACTION == 'apply') {
                                sh 'terraform apply -auto-approve'
                            } else if (params.TERRAFORM_ACTION == 'destroy') {
                                sh 'terraform destroy -auto-approve'
                            } else {
                                error "Invalid TERRAFORM_ACTION: ${params.TERRAFORM_ACTION}"
                            }
                        }
                    }
                }
            }
        }

        stage('Configure kubectl') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                script {
                    sh """
                    aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_DEFAULT_REGION}
                    kubectl get nodes
                    """
                }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                    dir('mern'){
                script {
                    sh 'docker build -t mern-backend ./backend'
                    sh 'docker build -t mern-frontend ./frontend'
                }
                }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                     withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                    // Replace with your ECR or Docker Hub repo
                    def dockerUser = "730335595521.dkr.ecr.ap-south-1.amazonaws.com/devops/mern-app"
                    def backendImage = "${dockerUser}:backend"
                    def frontendImage = "${dockerUser}:frontend"

                    sh """
                    aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 730335595521.dkr.ecr.ap-south-1.amazonaws.com
                    docker tag mern-backend $backendImage
                    docker tag mern-frontend $frontendImage
                    docker push $backendImage
                    docker push $frontendImage
                    """
                }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                    
                    script {
                        // Update image references in the YAMLs if needed
                        sh """
                        kubectl apply -f mern-app.yaml

                        """
                    
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                   withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creads'
                ]]) {
                sh 'kubectl get all'
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline Failed!'
        }
        success {
            echo 'MERN Stack Deployed on EKS!'
        }
    }
}
