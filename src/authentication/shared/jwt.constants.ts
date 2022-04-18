import * as configuration from 'src/config.json';

// This is now a symmetric key used to sign and verify the jwt token. Never share this!
// We could also use an asymmetric key algorithm, this way outsiders can also verify the jwt token, but cannot generate it.
// Let's keep this for a future implementation! https://www.npmjs.com/package/jsonwebtoken#usage
export let jwtSecret = process.env[configuration.environmentVariablesKeys.jwtsecret] || configuration.passport.jwtsecret;
// see jsonwebtoken package https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
export let expiresIn = configuration.passport.jwtexpiresIn; 