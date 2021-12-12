import GoogleService from './google-service';
import { thingISBN } from 'catalogues-library';
import _ from 'underscore';

export default class IsbnService {
    private googleService = new GoogleService();

    convertIsbn(isbn: string): string {
        // Convert a 10-digit ISBN to 13-digit ISBN
        isbn = '978' + isbn.substring(0,9);
		let total = 0;
        let y = 3;

        for (let x = 0; x < 12; x++) {
            if ((x % 2) == 0) { 
                y = 1; 
            }
            else { 
                y = 3; 
            }

            total = total + (parseInt(isbn.charAt(x)) * y);
        }

        return `${isbn}${(10 - (total % 10)) % 10}`;
    }

    async getEditions(isbn: string): Promise<string[]> {
        const promises = [];

        promises.push(this.googleService.getEditionsByIsbn(isbn));
        promises.push(this.queryIsbnThing(isbn));

        const result = await Promise.all(promises);

        return _.uniq(result.flat());
    }

    private async queryIsbnThing(isbn: string): Promise<string[]> {
        const result = await thingISBN(isbn);

        return _.chain(result)
            .map(x => x.length == 10 ? this.convertIsbn(x) : x)
            .filter(x => x.indexOf('9780') == 0 || x.indexOf('9781') == 0)
            .uniq()
            .value()
            .slice(0, 10);
    }
}