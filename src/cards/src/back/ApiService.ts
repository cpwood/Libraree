import { plainToInstance } from 'class-transformer';
import _ from 'underscore';
import type CardContext from './CardContext';
import Library from './Library';

export default class ApiService {
    libraries: Library[] = null;

    async listServices(filter: string, existing: Library[]): Promise<Library[]> {
        if (!this.libraries) {
            this.libraries = [];
            const response = await this.doFetch('https://libraree.azurewebsites.net/api/ListServices?code=aaFrwAhEVYJRmX5qnwWsRkInIcg8/c4AUKZ2/WugzoYTnxMk6BEKNQ==');
            this.libraries = _.map(response, x => plainToInstance(Library, x));
        }

        if (filter.length < 3)
            return [];

        const existingIds = _.map(existing, x => x.code);
        const items = _.filter(this.libraries, x => x.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
            && !existingIds.includes(x.code));
        
        return items;
    }

    async generatePass(context: CardContext): Promise<void> {
        let body = '';

        try{
            const files = [];

            for(const f of context.files) {
                files.push({
                    name: f.name,
                    checksum: await f.checksum()
                });
            }

            body = JSON.stringify({
                code: context.library.code,
                type: context.type.type,
                discovered: context.discovered,
                redactedEntered: context.redactedEntered,
                redactedScanned: context.redactedScanned,
                files: files
            });

            const response = await fetch('https://libraree.azurewebsites.net/api/GenerateCard?code=8lweoMwHcQZEPt9m7CoBSEOXqwWBpgdzy7ARjLIXBmzD5qEISx0zZQ==', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
    
            const data = await response.arrayBuffer();
            await context.finalise(data);
        }
        catch(e) {
            console.log(e);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async doFetch(url:string): Promise<any> {
        const response = await fetch(url);
        return await response.json();
    }
}