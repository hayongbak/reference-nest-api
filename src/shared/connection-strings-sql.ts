export interface ConnectionStringsSql{
    readonly type: "mysql"; // add other supported typeORM types here hardcoded when necessary
    host: string;
    port: number;
    username: string;
    password: string;
    readonly database: string;
}