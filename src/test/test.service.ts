import { Injectable, Inject } from '@nestjs/common';
import {Repository} from 'typeorm';
import { Test } from './data/test.entity';
import { GetTest } from './data/get-test.dto';
import { TEST_REPO } from 'src/shared/constants';
import { PostTestRes } from './data/post-test.dto';

@Injectable()
export class TestService {
    
    constructor(@Inject(TEST_REPO) private testRepo: Repository<Test>){ }

    public async retrieveTestToken(): Promise<GetTest> {
        try {
            let allTestEntries = await this.testRepo.find();    
            return {success: true, token: allTestEntries[0].token};
        } catch (error) {
            return {success: false, error: error.code || 'error_no_database'} // I could hard-code this to 'error_no_database'
        }
    }
    public async retrieveTestTokenByToken(token: string): Promise<PostTestRes> {
        try {
            let allTestEntries = await this.testRepo.findOneOrFail({ token: token });    
            return {success: true};
        } catch (error) {
            return {success: false} // I could hard-code this to 'error_no_database'
        }
    }
}
