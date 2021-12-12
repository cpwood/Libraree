import GoogleResult from './google-result';
import { plainToInstance } from 'class-transformer';
import _ from 'underscore';
import { Library, Settings } from './settings';
import { ServiceResult, AvailabilityResult } from './availability-result';

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
    
    async findTitles(filter: string): Promise<GoogleResult[]> {
        const response = await this.doFetch(`https://libraree.azurewebsites.net/api/FindTitles?code=aQ4MAQPvbEQrIjMB/GeZtRrrFYFSoR/7lHZn09wKiaLU0eWa8abqeg==&filter=${encodeURIComponent(filter)}`);
        return _.map(response, x => plainToInstance(GoogleResult, x));
    }

    async getEditionsByVolumeId(volumeId: string): Promise<string[]> {
        return await this.doFetch(`https://libraree.azurewebsites.net/api/GetEditions?code=AlovxtL6fEbcpaYCiVIoy7tpHbJFgadz8hvaozaF4hQ6Zf9SRiy3Ww==&volumeId=${encodeURIComponent(volumeId)}`);
    }

    async getEditionsByIsbn(isbn: string): Promise<string[]> {
        return await this.doFetch(`https://libraree.azurewebsites.net/api/GetEditions?code=AlovxtL6fEbcpaYCiVIoy7tpHbJFgadz8hvaozaF4hQ6Zf9SRiy3Ww==&isbn=${encodeURIComponent(isbn)}`);
    }

    async searchLibraries(isbns: string[], settings: Settings): Promise<ServiceResult[]> {
        const promises = [];

        // Query catalogues
        for (const library of settings.libraries) {
            for (const isbn of isbns) {
                promises.push(this.doFetch(`https://libraree.azurewebsites.net/api/SearchLibrary?code=OjDK0IsVNnXEqZVQOS4F32EnUgfuIexl76Cq0BV6dFzr5sTm//yXKw==&isbn=${isbn}&service=${library.code}`));
            }
        }

        const promiseResults = await Promise.all(promises);
        let results = promiseResults.flat();

        // We want each URL only once.
        results =  _.uniq(results, x => x.url);

        // We only want libraries that hold stock, even if that stock is currently on loan.
        results = _.filter(results, x => x.availability.length > 0);

        // Begin restructuring the resultset. Group by Local Authority and then by library service.
        const services = _.uniq(_.map(results, x => {
            return new ServiceResult(
                x.service,
                x.code,
                settings.isFavourite(x.code)
            );
        }), x => x.code);

        for (const service of services) {
            // Across all ISBNs, find stock for a particular library.
            const serviceResults = _.filter(results, x => x.code == service.code);

            service.items = _.map(serviceResults, result => _.map(result.availability, x => {
                return new AvailabilityResult(
                    result.url,
                    x.library,
                    x.available,
                    x.available + x.unavailable,
                    result.isbn
                );
            })).flat();
                            

            service.items = _.sortBy(service.items, x => x.sortKey);
        }

        return _.sortBy(services, x => x.sortKey);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async doFetch(url:string): Promise<any> {
        const response = await fetch(url);
        return await response.json();
    }
}