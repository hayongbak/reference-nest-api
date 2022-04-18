## Description
This project is the basic api used for Gaimer as a platform. You should be able to follow the steps from this readme to create your own Rest API on top of a MariaDB server.

## Installation
There is a wsl_setup.sh file that you can use to install mariadb, node (through nvm), nestjs and a sql script to create the databases (there are a couple of changes necessary here and there!). In the following steps I will highlight the different steps you should use.
>NOTE: this script assumes you've got curl, the build-essentials, file and git already installed. If you don't you can use the following script:
```bash
$ sudo apt-get install build-essential curl file git
```


### Installing Maria DB and starting it up

```bash
$ curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
$ sudo apt install --yes --force-yes  mariadb-server
$ sudo service mysql start
```
This makes sure you first add to apt-get the mariadb latest stable repository. We then use apt to install the mariadb-server and start it up.

If you want to make sure you've got the most secure mariadb settings, you can use the following tool. Answer yes to all security questions for the most secure option.
> NOTE: this will block the root user from being accessed remotely!
```bash
$ sudo mysql_secure_installation
```

Lastly we'll create a database with tables and dummy data (where applicable) by running the sql script. Have a look at the sql script first however, because the user that gets created for the app needs to get a password - and that is something you need to set (look for &lt;your password in single quotes&gt; and replace it with something like 'MyP@ssword1234' or anything you want between single quotes)
```bash
$ sudo mysql < ./starting-template.sql
```

### Installing npm if you don't have it yet
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
$ nvm install --latest-npm
$ nvm use <the latest version>
```

### Install nestjs cli - is not really necessary for a production environment
```bash
$ sudo npm i -g @nestjs/cli
```

### Installing the node packages
Don't forget to install all node modules before trying to run the application
```bash
$ npm install
```

### Update configuration
Go into the config.json file (under the src folder) to modify settings if necessary. In that same file you can find environment variable keys, like ___basic_db_username___. These keys are used in the application to access environment variables. If you add this on your server as a environment variable and add (in this case) the username for the database, you should be able to run the application with these values instead of the config.json one.

You have the following environment variables:
- basic_db_username: the username for the database
- basic_db_password: the password for the database
- jwtsecret: the secret used to sign the jwt tokens

In the config.json file you will see that there are already default values defined for everything. You can use those values and adjust them if you want to. We prefer to use the environment variables for secrets, because that way they don't accidentaly get checked into a source control.

There are a couple of values for the config.json that are important to have a look at:
- connectionStrings: everything in here is made to connect to a database
- passport: these are settings used for the passport library 
- queryParams: these values specify the upper limit of elements that will be returned when a list of items is requested
- adminIds: used for "hardcoding" admin IDs for users
- steamBot: the Steam Bot needs a user ID (when it talks to us). ```maxExponentialTimeout``` is a value in seconds, we will retry the steambot call after two seconds, then four, then eight up until that value is over ```maxExponentialTimeout```. ```getSteamId``` is the route on the steambot service.


### Port configuration
By default the port number used to listen to incoming requests is set in the main.ts file. It might be that this needs to change depending on the host.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Testing the Rest API
## Insomnia
There is an insomnia file attached that you can use to import into the Rest Client called insomnia. In it you should find premade requests that you can use to test requests made to the application. These should all work.

## OpenApi Specification (previously Swagger)
The application has an OpenApi documentation made automatically based on the controller and its data. You can access it by going to the "&lt;application url&gt;/swagger" url. 


## License

  Nest is [MIT licensed](LICENSE).
