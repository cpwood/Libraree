import type CardContext from './CardContext';

export default class ApiService {
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