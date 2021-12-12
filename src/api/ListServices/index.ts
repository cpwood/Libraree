import { AzureFunction, Context } from '@azure/functions';
import _ from 'underscore';
import Library from '../models/library';
import libraries from 'catalogues-library/data/data.json';

const results = _.map(libraries.LibraryServices, x => {
    return new Library(x.Name, x.Code);
});

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
    context.res = {
        body: results,
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

export default httpTrigger;