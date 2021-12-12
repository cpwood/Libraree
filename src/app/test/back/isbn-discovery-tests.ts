// import 'reflect-metadata';
// import { expect } from 'chai';
// import IsbnDiscovery from '../../src/back/isbn-discovery';

// describe('ISBN Discovery', () => {
//     it('should find multiple results from a search', async () => {
//         const discovery = new IsbnDiscovery();

//         // "The King of Sunlight" by Adam Macqueen
//         const results = await discovery.search('the king of sunlight');

//         expect(results).to.have.lengthOf.above(0);
//         console.log(JSON.stringify(results, null, 4));
//     });

//     it('should find multiple ISBNs from one Google Books Volume record', async () => {
//         const discovery = new IsbnDiscovery();

//         // "The King of Sunlight" by Adam Macqueen
//         const results = await discovery.getEditions('7mqj9HnfmdwC');

//         expect(results).to.have.lengthOf.above(0);
//         console.log(JSON.stringify(results, null, 4));
//     });
// });