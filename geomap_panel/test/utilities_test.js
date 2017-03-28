import Utilities from '../src/utilities';

describe('Utilities', () => {
    let utilities;

    beforeEach(() => {
        setupUtilities();
    });

    describe('when clamp is used', () => {
        it('it should return the correct values', () => {
            expect(utilities.clamp(5, 3, 10)).to.equal(5);
            expect(utilities.clamp(1, 3, 10)).to.equal(3);
            expect(utilities.clamp(15, 3, 10)).to.equal(10);
        });
    });

    describe('when clamp01 is used', () => {
        it('it should return the correct values', () => {
            expect(utilities.clamp01(0.5)).to.equal(0.5);
            expect(utilities.clamp01(1.5)).to.equal(1);
            expect(utilities.clamp01(-0.3)).to.equal(0);
        });
    });

    describe('when arrayIndexOf is used', () => {
        it('it should return the correct value', () => {
            expect(utilities.arrayIndexOf([2, 0, 1], 2)).to.equal(0);
            expect(utilities.arrayIndexOf([2, 0, 1], 0)).to.equal(1);
            expect(utilities.arrayIndexOf([2, 0, 1], 1)).to.equal(2);
        });

        it('it should return -1 for not present indices', () => {
            expect(utilities.arrayIndexOf([2, 0, 1], 5)).to.equal(-1);
        });
    });

    function setupUtilities () {
        utilities = new Utilities();
    }
});
