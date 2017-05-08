import TimelapseHandler from '../src/timelapseHandler';

describe('TimelapseHandler', () => {
    let ctrl;
    let timelapseHandler;

    beforeEach(() => {
        setupHandler();
    });

    describe('when starting the timelapse', () => {
        beforeEach(() => {
            timelapseHandler.start();
        });

        it('it should be animating', () => {
            expect(timelapseHandler.isAnimating).to.equal(true);
        });

        it('it should not be paused', () => {
            expect(timelapseHandler.isAnimatingPaused).to.equal(false);
        });
    });

    describe('when pausing the timelapse', () => {
        beforeEach(() => {
            timelapseHandler.start();
            timelapseHandler.pause();
        });

        it('it should be animating', () => {
            expect(timelapseHandler.isAnimating).to.equal(true);
        });

        it('it should be paused', () => {
            expect(timelapseHandler.isAnimatingPaused).to.equal(true);
        });
    });

    describe('when stopping the timelapse', () => {
        beforeEach(() => {
            timelapseHandler.start();
            timelapseHandler.stop();
        });

        it('it should not be animating', () => {
            expect(timelapseHandler.isAnimating).to.equal(false);
        });

        it('it should not be paused', () => {
            expect(timelapseHandler.isAnimatingPaused).to.equal(false);
        });
    });

    describe('when manually setting the percent', () => {
        beforeEach(() => {
            timelapseHandler.setPercent(75);
        });

        it('it should be animating', () => {
            expect(timelapseHandler.isAnimating).to.equal(true);
        });

        it('it should be paused', () => {
            expect(timelapseHandler.isAnimatingPaused).to.equal(true);
        });
    });

    describe('when getting the current', () => {
        beforeEach(() => {
            timelapseHandler.current = 1;
        });

        it('it should result in current - 1', () => {
            expect(timelapseHandler.getCurrent()).to.equal(0);
        });
    });

    describe('when setting the timestamp interval', () => {
        beforeEach(() => {
            timelapseHandler.setTimestampInterval(0, 1000);
        });

        it('it should set the first timestamp to 0', () => {
            expect(timelapseHandler.firstTimestamp).to.equal(0);
        });

        it('it should set the last timestamp to 1000', () => {
            expect(timelapseHandler.lastTimestamp).to.equal(1000);
        });
    });

    function setupHandler () {
        ctrl = {
            formatTime: () => {
                return 'test'
            },
            map: {
                updateData: () => {

                }
            },
            scope: {
                $apply: () => {

                }
            }
        };

        timelapseHandler = new TimelapseHandler(ctrl)
    }
});
