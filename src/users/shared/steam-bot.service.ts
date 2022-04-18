import { Injectable, HttpService } from '@nestjs/common';
import * as config from 'src/config.json';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class SteamBotService {
    constructor(private http: HttpService){}

    getSteamIdFromSteamUsername(username: string, endpoint: string): Observable<string>{
        let url = `${endpoint}${config.steamBot.getSteamId}`;
        return this.http.post(url, {username: username}).pipe(map(resp => resp.data.accountid));
    }
}
