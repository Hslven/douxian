const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

const PM2_APP_NAME = 'dxWeb';

const REMOTE_USER = 'root';
const REMOTE_HOST = '172.81.211.63';
const REMOTE_PORT = 22999;
const REMOTE_PATH = `/data/nginx/${PM2_APP_NAME}`;

const LOCAL_PROJECT_PATH = path.resolve(__dirname, './');
const FILES_TO_UPLOAD = ['package.json', '.next', 'next.config.js', 'public'];

const BUILD_COMMAND = 'npm run build';

async function buildCommand() {
  console.log('🛠️ Build 开始执行');
  await execPromise(BUILD_COMMAND, { cwd: LOCAL_PROJECT_PATH });
  console.log('✅ Build 执行完成\n');
}

async function uploadFiles() {
  console.log('🚀 上传文件中...');

  const mkdirCommand = `ssh ${REMOTE_USER}@${REMOTE_HOST} -p ${REMOTE_PORT} "mkdir -p ${REMOTE_PATH}"`;
  await execPromise(mkdirCommand);

  const uploadPromises = FILES_TO_UPLOAD.map(async (item) => {
    const sourcePath = path.join(LOCAL_PROJECT_PATH, item);
    const targetPath = `${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/`;

    console.log(`📂 上传 ${sourcePath} 到 ${targetPath}`);
    // await execPromise(`rsync -avz --delete ${sourcePath} ${targetPath}`);
    await execPromise(`scp -P ${REMOTE_PORT} -r ${sourcePath} ${targetPath}`);
  });

  await Promise.all(uploadPromises);

  console.log('✅ 文件上传完成\n');
}

async function main() {
  console.log('====== 📤 开始部署任务 ======\n');

  await buildCommand();
  await uploadFiles();

  console.log('====== ✅ 一键上传完成 ======');
  console.log(new Date().toLocaleString('zh-cn'), '\n');
}

main();
