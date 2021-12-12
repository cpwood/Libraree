import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import GoogleService from '../services/google-service';


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const filter = req.query.filter;
    const service = new GoogleService();
    const result = await service.getTitles(filter);

    context.res = {
        body: result,
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;