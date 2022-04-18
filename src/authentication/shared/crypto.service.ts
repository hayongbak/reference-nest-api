import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import * as crypto from 'crypto';


const saltRounds = 12;

@Injectable()
export class CryptoService {
    async hashPassword(plaintext: string): Promise<string> {
        let salt = await genSalt(saltRounds);
        return hash(plaintext, salt);
    }
    async verifyHashes(existingHash: string, passwordToBeVerified: string): Promise<boolean> {
        return await compare(passwordToBeVerified, existingHash);
    }
    createRandomToken(length: number): string{
        return crypto.randomBytes(length).toString('hex');
    }
}
