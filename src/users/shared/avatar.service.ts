import { Injectable } from '@nestjs/common';
import { avatarlist } from './avatar-job.cron';

@Injectable()
export class AvatarService {
    

    async generateRandomAvatarUrl(): Promise<string> {
        let face = avatarlist.face;
        let eye = face.eyes[this.getRandomIntInclusive(0, face.eyes.length)];
        let mouth = face.mouth[this.getRandomIntInclusive(0, face.mouth.length)];
        let nose = face.nose[this.getRandomIntInclusive(0, face.nose.length)];
        let color = Math.floor(Math.random() * 16777215).toString(16);
        return `https://api.adorable.io/avatars/face/${eye}/${nose}/${mouth}/${color}`;
    }

    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }


}
