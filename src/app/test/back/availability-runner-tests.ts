// import 'reflect-metadata';
// import { expect } from 'chai';
// import AvailabilityRunner from '../../src/back/availability-runner';
// import { Library, Settings } from '../../src/back/settings';

// describe('Availability Runner', () => {
//     it('should check multiple ISBNs across multiple libraries', async () => {
//         const settings = buildSettings();
//         const runner = new AvailabilityRunner(settings);

//         // "And away.." by Bob Mortimer
//         const results = await runner.find([ '9781398505292', '9781398508026' ]);
//         expect(results).to.have.lengthOf(2);
//         expect(results[0].items).to.have.lengthOf.above(0);
//         expect(results[1].items).to.have.lengthOf.above(0);

//         console.log(JSON.stringify(results, null, 4));
//     });
// });

// function buildSettings(): Settings {
//     const settings = new Settings();
        
//     const wigan = new Library();
//     wigan.code = 'E08000010';
//     wigan.name = 'Wigan';
//     wigan.favourite = true;

//     const manchester = new Library();
//     manchester.code = 'E08000003';
//     manchester.name = 'Manchester';
//     manchester.favourite = false;

//     settings.libraries.push(wigan);
//     settings.libraries.push(manchester);

//     return settings;
// }