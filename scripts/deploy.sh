# runs on remote machine via deploy workflow
# pulls latest changes, then restarts the process instance
# process is managed via PM2

processName="github-contributions"

# Exit when any command fails
set -e

git reset --hard --quiet

echo "Pulling from origin"
git pull --quiet

# Ensure that npm can be found by GitHub actions
# See: https://gist.github.com/danielwetan/4f4db933531db5dd1af2e69ec8d54d8a?permalink_comment_id=4057972
echo "Setting up NVM"
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

export NODE_ENV=production

echo "Installing dependencies"
npm install --omit=dev --silent --frozen-lockfile

echo "Building"
npm run build

echo "Killing old instance"
# Deletion is allowed to fail, since the process might not have been running previously
pm2 delete $processName --silent || true 

echo "Starting new instance"
pm2 start "npm run start" --name $processName --max-memory-restart 300M --silent