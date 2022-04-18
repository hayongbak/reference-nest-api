import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RenderService {
    /**
     * Allows to render HTML dynamically based on the Handlebars View Template Engine
     * @param input The object being put in the View
     * @param viewpath The view to render (relative path without extension starting from the views folder)
     * @param request The current Http Request (@Res() decorator in controller)
     */
    public async renderViewInternal<T extends object>(input: T, viewpath: string, request: Request): Promise<string> {
        let task = new Promise<string>((resolve, reject) => {
            request.app.render(viewpath, input, (err, html) => {
                if (err) {
                    reject(err);
                }
                resolve(html);
            });
        });
        let html = await task;
        return html;
    }


}
