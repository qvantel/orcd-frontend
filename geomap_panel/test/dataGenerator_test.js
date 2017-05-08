import DataGenerator from '../src/dataGenerator';
import Utilities from '../src/utilities';

describe('DataGenerator', () => {
    let dataGenerator;
    let ctrl;

    beforeEach(() => {
        setupDataGenerator();
    });

    describe('When data is generated', () => {
        var data = [];

        beforeEach(() => {
            data = dataGenerator.generate();
        });

        it('it should data for each country', () => {
            expect(typeof data['SE']).to.not.equal(undefined);
            expect(typeof data['FI']).to.not.equal(undefined);
            expect(typeof data['NO']).to.not.equal(undefined);
            expect(typeof data['DK']).to.not.equal(undefined);
        });
    });

    function setupDataGenerator () {
        ctrl = {
            locations: {
                countries: {
                    'SE': '150',
                    'FI': '150',
                    'NO': '150',
                    'DK': '150'
                }
            },
            panel: {
                showTrends: false
            },
            utilities: new Utilities()
        };

        dataGenerator = new DataGenerator(ctrl);
    }
});
