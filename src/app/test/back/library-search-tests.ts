// import 'reflect-metadata';
// import { expect } from 'chai';
// import LibrarySearch from '../../src/back/library-search';
// import { Library } from '../../src/back/settings';

// describe('Library Search', () => {
//     it('should find Wigan library', async () => {
//         const librarySearch = new LibrarySearch();

//         const results = await librarySearch.find('wig', []);

//         expect(results).to.have.lengthOf(2);
//         expect(results[0].name).to.equal('Isle of Wight');
//         expect(results[1].name).to.equal('Wigan');
//         console.log(JSON.stringify(results, null, 4));
//     });

//     it('shouldn\'t find Wigan library when it\'s already defined', async () => {
//         const librarySearch = new LibrarySearch();
//         const wigan = new Library();
//         wigan.code = 'E08000010';
//         wigan.name = 'Wigan';
//         wigan.favourite = true;

//         const results = await librarySearch.find('wig', [ wigan ]);

//         expect(results).to.have.lengthOf(1);
//         expect(results[0].name).to.equal('Isle of Wight');
//         console.log(JSON.stringify(results, null, 4));
//     });
// });