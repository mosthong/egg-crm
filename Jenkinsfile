node{
        stage('checkout'){
            checkout scm
        }
        
        // env
        stage('branch') {

            sh 'git name-rev --name-only HEAD > GIT_BRANCH'
            sh 'cat GIT_BRANCH'
            
            env.GIT_BRANCH = readFile('GIT_BRANCH').trim()
            sh "echo GIT_BRANCH：${env.GIT_BRANCH}"
            env.BRANCH_NAME = env.GIT_BRANCH.replace("remotes/origin/", "")
            sh "echo BRANCH_NAME：${env.BRANCH_NAME}"
            
            // sh 'git rev-parse HEAD > commit'
            // sh 'cat commit'
        }
            
        // test
        stage('test') {
            sh 'pwd'
            sh 'ls -la'    
            sh 'ls -la /usr/local/jdk1.8.0_201/'
        }
            
        // node build
        stage('node') {
            sh 'node -v'
            sh 'npm -v'
            sh 'npm cache verify'
            sh 'npm install'
            sh 'npm run build:prod'
        }
        

        // docker build
        stage('deploy') {
            sh 'echo ${BUILD_ID}-$(date "+%Y%m%d") docker'
            sh "echo ${env.GIT_BRANCH}:${env.BRANCH_NAME} docker"
            sh "sudo docker build -t registry-vpc.cn-shenzhen.aliyuncs.com/jp-develop/website-admin:${env.BRANCH_NAME} ."
            sh "sudo docker push registry-vpc.cn-shenzhen.aliyuncs.com/jp-develop/website-admin:${env.BRANCH_NAME}"
            sh "sudo docker rmi -f registry-vpc.cn-shenzhen.aliyuncs.com/jp-develop/website-admin:${env.BRANCH_NAME}"
        }

}
