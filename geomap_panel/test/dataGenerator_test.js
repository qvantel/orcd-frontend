import DataGenerator from '../src/dataGenerator';

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
            expect(data[1][0]).to.equal('SE');
            expect(data[2][0]).to.equal('FI');
            expect(data[3][0]).to.equal('NO');
            expect(data[4][0]).to.equal('DK');
        });

        it('it should have valid data between 0-100 for each country', () => {
            expect(data[1][1]).to.be.within(0, 100);
            expect(data[2][1]).to.be.within(0, 100);
            expect(data[3][1]).to.be.within(0, 100);
            expect(data[4][1]).to.be.within(0, 100);
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
            }
        };

        dataGenerator = new DataGenerator(ctrl);
    }
});
