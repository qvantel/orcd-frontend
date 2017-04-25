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
                datapoints: [[100, 0], [300, 0], [20, 0], [244, 0]]
            }]);
        });

        it('it should return correctly formatted data', () => {
            expect(data['SE'].cur).to.equal(244);
            expect(data['SE'].min).to.equal(20);
            expect(data['SE'].max).to.equal(300);
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
            expect(data.length).to.equal(0);
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
            expect(data.length).to.equal(0);
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
            },
            panel: {
                showTrends: false
            }
        };

        dataFormatter = new DataFormatter(ctrl);
    }
});
