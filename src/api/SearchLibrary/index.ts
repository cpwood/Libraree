import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { availability } from 'catalogues-library';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const results = await availability(req.query.isbn, req.query.service);

    results.forEach(r => {
        r.isbn = req.query.isbn;
    });

    context.res = {
        body: results,
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;