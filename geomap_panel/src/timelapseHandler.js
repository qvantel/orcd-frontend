import moment from 'moment';

const animationStep = 500;
const timestampLength = 10000;

export default class TimelapseHandler {
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.isAnimating = false;
        this.isAnimatingPaused = false;
        this.firstTimestamp = undefined;
        this.lastTimestamp = undefined;
        this.timeout = undefined;
        this.current = 0;
        this.isDragging = false;

        var self = this;
        $('document').ready(function () {
            $('body').mouseup(function (e) {
                self.stopDrag(e);
            });
        });
    }

    startDrag () {
        this.isDragging = true;

        var self = this;
        $('body').mousemove(function (e) {
            self.doDrag(e);
        });
    }

    stopDrag (e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        $('body').unbind('mousemove');
        this.doDrag(e);
    }

    doDrag (e) {
        var left = $('#timelapse-progress-bar').offset().left;
        var right = left + $('#timelapse-progress').width();
        var percent = (e.pageX - left) / (right - left);
        percent = this.ctrl.utilities.clamp01(percent);

        this.setPercent(percent);
    }

    setTimestampInterval (first, last) {
        this.current -= Math.floor((first - this.firstTimestamp) / timestampLength);

        if (this.current < 0) {
            this.current = 0;
        }

        this.firstTimestamp = first;
        this.lastTimestamp = last;

        if (!this.isAnimating) {
            this.setTimestampUI(this.lastTimestamp);
        }
    }

    start (animate) {
        if (!this.isAnimatingPaused) {
            this.current = 0;
        }

        this.isAnimating = true;
        this.isAnimatingPaused = false;

        this.ctrl.refresh();

        if (typeof animate === 'undefined' || animate) {
            this.animate();
        }
    }

    pause () {
        this.isAnimatingPaused = true;
        clearTimeout(this.timeout);
    }

    stop () {
        this.isAnimating = false;
        this.isAnimatingPaused = false;
        clearTimeout(this.timeout);
        this.setPercentUI(100);
        this.setTimestampUI(this.lastTimestamp);
        this.ctrl.map.updateData();
        this.ctrl.refresh();
    }

    setPercent (percent) {
        this.start(false);
        this.current = Math.floor(((this.lastTimestamp - this.firstTimestamp) / timestampLength) * percent);
        this.pause();
        this.animate(true);
    }

    animate (force) {
        if (!force && (!this.isAnimating || this.isAnimatingPaused)) return;

        this.current += 1;

        if (this.current * timestampLength + this.firstTimestamp > this.lastTimestamp) {
            this.stop();
            return;
        }

        var percent = (this.current / ((this.lastTimestamp - this.firstTimestamp) / timestampLength));
        percent = Math.floor(percent * 100);
        this.setPercentUI(percent);

        var timestamp = this.current * timestampLength + this.firstTimestamp;
        this.setTimestampUI(timestamp);

        this.ctrl.map.updateData();

        var self = this;
        this.timeout = setTimeout(() => {
            self.animate();
        }, animationStep);
    }

    setPercentUI (percent) {
        $('#timelapse-progress-bar').css('width', percent + '%');
    }

    setTimestampUI (timestamp) {
        timestamp = moment.unix(timestamp / 1000).format('DD-MM-YYYY HH:mm:ss');
        $('#timelapse-timestamp').html(timestamp);
    }

    getCurrent () {
        return this.current;
    }
}
