
import { Injectable, Logger, HttpService } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

export let avatarlist: { face: { eyes: string[], mouth: string[], nose: string[] } };

@Injectable()
export class AvatarCronJob {

  constructor(private http: HttpService) { }

  @Cron('0 0 3 * * 6')
  handleCron() {
    this.http.get('https://api.adorable.io/avatars/list').subscribe((values) => avatarlist = values.data);
  }

  @Timeout(5000)
  handleTimeout() {
    this.http.get('https://api.adorable.io/avatars/list').subscribe((values) => avatarlist = values.data);
  }
}