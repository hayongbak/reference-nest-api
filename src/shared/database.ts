import { Injectable } from '@nestjs/common';
import { createConnection } from 'typeorm';
import {DB_CONNECTION} from './constants';
import * as configuration from '../config.json';
import { ConnectionStringsSql } from './connection-strings-sql';


let basicDb = configuration.connectionStrings.basic as ConnectionStringsSql;
// Adding some logic to read the password and username from environment variables - just in case nobody wants to share their password
basicDb.username = process.env[configuration.environmentVariablesKeys.basicDB.username] || basicDb.username;
basicDb.password = process.env[configuration.environmentVariablesKeys.basicDB.password] || basicDb.password;
basicDb.port = +process.env[configuration.environmentVariablesKeys.basicDB.port] || basicDb.port;
basicDb.host = process.env[configuration.environmentVariablesKeys.basicDB.hostname] || basicDb.host;

export let databaseConfig = {
  type: basicDb.type,
  host: basicDb.host,
  port: basicDb.port,
  username: basicDb.username,
  password: basicDb.password,
  database: basicDb.database,
  entities: [
      __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: false,
  // debug: true // put this back to see all SQL commands - and extras going from the API to the DB
};

export const databaseProviders = [
  {
    provide: DB_CONNECTION,
    useFactory: async () => await createConnection(databaseConfig),
  }
];