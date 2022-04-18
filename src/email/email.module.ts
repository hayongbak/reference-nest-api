import { Module, HttpModule } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [{provide: MailService, useClass: SendGridService}],
  exports: [MailService],
  imports: [ HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  })]
})
export class EmailModule {}
