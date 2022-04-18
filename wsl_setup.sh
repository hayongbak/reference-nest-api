sudo apt-get upgrade
sudo apt-get update

#adding build tools (and curl file git if they aren't here yet)
sudo apt-get install build-essential curl file git
#lets install nvm to install node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
nvm install --latest-npm

sudo npm i -g @nestjs/cli

#update apt for mariadb downloads
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
sudo apt install --yes --force-yes  mariadb-server
sudo /etc/init.d/mysql start
sudo mysql_secure_installation
# script is optional - answer yes to all security questions for the most secure option
# this will also block the root user from being accessed remotely!
# make sure to write down your root password!
# next we'll create a database and create a user with priviliges and some dummy data
sudo mysql < ./starting-template.sql

