import DataFormatter from '../src/dataFormatter';

describe('DataFormatter', () => {
    let dataFormatter;
    let ctrl;

    beforeEach(() => {
        setupDataFormatter();
    });

    describe('When data exists and are correct', () => {
        var data = [];

        beforeEach(() => {
            data = dataFormatter.generate([{
                target: 'SE',
                datapoints: [[100, 0]]
            }]);
        });

        it('it should return correctly formatted data', () => {
            expect(data[1][0]).to.equal('SE');
            expect(data[1][1]).to.equal(100);
        });
    });

    describe('When data exists and are split', () => {
        var data = [];

        beforeEach(() => {
            data = dataFormatter.generate([{
                target: 'SE',
                datapoints: [[100, 0], [40, 0]]
            }]);
        });

        it('it should return correctly formatted data', () => {
            expect(data[1][0]).to.equal('SE');
            expect(data[1][1]).to.equal(140);
        });
    });

    describe('When data exists but countries has not been recieved', () => {
        var data = [];

        beforeEach(() => {
            dataFormatter.ctrl.locations = null;
            data = dataFormatter.generate([{
                target: 'SE',
                datapoints: [[100, 0]]
            }]);
        });

        it('it should not return data', () => {
            expect(data.length).to.equal(1);
        });
    });

    describe('When an undefined region is used', () => {
        var data = [];

        beforeEach(() => {
            data = dataFormatter.generate([{
                target: 'SE2',
                datapoints: [[100, 0]]
            }]);
        });

        it('it should not return data for that country', () => {
            expect(data.length).to.equal(1);
        });
    });

    function setupDataFormatter () {
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

        dataFormatter = new DataFormatter(ctrl);
    }
});
