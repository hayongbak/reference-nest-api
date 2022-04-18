import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { Test } from './data/test.entity';
import { Connection, Repository } from 'typeorm';
import { DB_CONNECTION, TEST_REPO } from 'src/shared/constants';
import { SharedModule } from 'src/shared/shared.module';
import { EmailModule } from 'src/email/email.module';



export const testProviders = [
  {
    provide: TEST_REPO,
    useFactory: (connection: Connection) => connection.getRepository(Test),
    inject: [DB_CONNECTION],
  },
];


@Module({
  controllers: [TestController],
  imports: [SharedModule],
  providers: [...testProviders, TestService ]
})
export class TestModule {}
