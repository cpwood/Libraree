import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { plainToClass } from 'class-transformer';
import CardRequest from '../models/CardRequest';
import Generator from './Generator';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // Get body, generate zip with signature, return.
    const request = plainToClass(CardRequest, req.body);
    const service = new Generator();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: await service.generatePkpass(request),
        headers: {
            'Content-Type': 'application/vnd.apple.pkpass'
        }
    };
};

export default httpTrigger;