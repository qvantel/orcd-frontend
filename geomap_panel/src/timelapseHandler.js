import moment from 'moment';

const animationStep = 500;

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
        this.timestampLength = 10000;

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

        $('body').unbind('mousemove');
        this.doDrag(e);
        this.isDragging = false;
    }

    doDrag (e) {
        var left = $('#timelapse-progress-bar').offset().left;
        var right = left + $('#timelapse-progress').width();
        var percent = (e.pageX - left) / (right - left);
        percent = this.ctrl.utilities.clamp01(percent);

        this.setPercent(percent);
    }

    setTimestampInterval (first, last, timestampLength) {
        var durationSplitRegexp = /(\d+)(ms|s|m|h|d|w|M|y)/;
        var m = timestampLength.match(durationSplitRegexp);
        var dur = moment.duration(parseInt(m[1]), m[2]);
        timestampLength = dur.asMilliseconds();

        var diff = timestampLength / this.timestampLength;
        this.current = Math.round(this.current / diff);
        this.current = this.current - Math.round((first - this.firstTimestamp) / this.timestampLength);

        this.timestampLength = timestampLength;

        if (this.current < 0) {
            this.current = 0;
        }

        this.firstTimestamp = first;
        this.lastTimestamp = last;

        if (!this.isAnimating) {
            this.setTimestampUI(this.lastTimestamp);
        }
    }

    start () {
        if (!this.isAnimatingPaused && !this.isDragging) {
            this.current = 0;
        }

        this.isAnimating = true;
        this.isAnimatingPaused = false;

        this.ctrl.log('Animating: ' + this.isAnimating + ' Paused: ' + this.isAnimatingPaused);

        // this.ctrl.render();
        // this.ctrl.scope.$apply();
        this.animate();
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
    }

    setPercent (percent) {
        this.current = Math.floor(((this.lastTimestamp - this.firstTimestamp) / this.timestampLength) * percent);

        this.start();
        this.pause();
        this.ctrl.scope.$apply();
    }

    animate () {
        if (!this.isAnimating || this.isAnimatingPaused) return;

        this.current += 1;

        if (this.current * this.timestampLength + this.firstTimestamp > this.lastTimestamp) {
            this.stop();
            this.ctrl.scope.$apply();
            return;
        }

        var percent = (this.current / ((this.lastTimestamp - this.firstTimestamp) / this.timestampLength));
        percent = Math.floor(percent * 100);
        this.setPercentUI(percent);

        var timestamp = this.current * this.timestampLength + this.firstTimestamp;
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
