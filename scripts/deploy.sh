# runs on remote machine via deploy workflow
# pulls latest changes, then restarts the process instance
# process is managed via PM2

processName="github_contributions"

# exit when any command fails
set -e

git reset --hard --quiet

echo "Pulling from origin"
git pull --quiet

echo "Installing dependencies"
npm install --silent --frozen-lockfile

echo "Building"
npm run build

export NODE_ENV=production

echo "Killing old instance"
# deletion is allowed to fail, since the process might not have been running previously
pm2 delete $processName --silent || true 

echo "Starting new instance"
pm2 start . --name $processName --silent