# runs on remote machine via deploy workflow
# pulls latest changes, then restarts the process instance
# process is managed via PM2

processName="github-contributions"

# exit when any command fails
set -e

git reset --hard --quiet

echo "Pulling from origin"
git pull --quiet

export NODE_ENV=production

echo "Installing dependencies"
npm install --omit=dev --silent --frozen-lockfile

echo "Building"
npm run build

echo "Killing old instance"
# deletion is allowed to fail, since the process might not have been running previously
pm2 delete $processName --silent || true 

echo "Starting new instance"
pm2 start "npm run start" --name $processName --max-memory-restart 300M --silent