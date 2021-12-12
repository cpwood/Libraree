import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import GoogleService from '../services/google-service';
import IsbnService from '../services/isbn-service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get HTML for volume and identify hyperlinks to other editions. Return a 
    // distinct list of ISBN-13 numbers.
    const isbn = req.query.isbn;
    const volumeId = req.query.volumeId;
    const service = new IsbnService();
    const google = new GoogleService();

    const result = isbn ? await service.getEditions(isbn) : await google.getEditionsByVolumeId(volumeId);

    context.res = {
        body: result,
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;