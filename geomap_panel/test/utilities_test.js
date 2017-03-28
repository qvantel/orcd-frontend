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

    function setupUtilities () {
        utilities = new Utilities();
    }
});
