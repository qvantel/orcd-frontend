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

    /**
     * Should be called when the user starts dragging the progress bar
     */
    startDrag () {
        this.isDragging = true;

        var self = this;
        $('body').mousemove(function (e) {
            self.doDrag(e);
        });
    }

    /**
     * Should be called when the user stops dragging the progress bar (mouse up)
     */
    stopDrag (e) {
        if (!this.isDragging) return;

        $('body').unbind('mousemove');
        this.doDrag(e);
        this.isDragging = false;
    }

    /**
     *  Calculates and sets the percentage of the timelapse progress depending on where the user dragged it.
     */
    doDrag (e) {
        var left = $('#timelapse-progress-bar').offset().left;
        var right = left + $('#timelapse-progress').width();
        var percent = (e.pageX - left) / (right - left);
        percent = this.ctrl.utilities.clamp01(percent);

        this.setPercent(percent);
    }

    /**
     * Sets the timestampInterval. (The interval between each datapoint) and updates the current position so the progress percentage does not change.
     *
     * @param {number} first - Unix timestamp of the first datapoint
     * @param {number} last - Unix timestamp of the last datapoint
     * @param {string} timestampLength - The interval between the timestamps in a grafana supported string format. (1h / 1d / 1m / 20M etc.)
     */
    setTimestampInterval (first, last) {
        // In case the timestampLength is not the same as before, calculate the new current position.
        var diff = this.ctrl.timestampLength / this.timestampLength;
        this.current = Math.round(this.current / diff);
        this.current = this.current - Math.round((first - this.firstTimestamp) / this.timestampLength);

        if (this.current < 0) {
            this.current = 0;
        }

        this.timestampLength = this.ctrl.timestampLength;
        this.firstTimestamp = first;
        this.lastTimestamp = last;

        if (!this.isAnimating) {
            this.setTimestampUI(this.lastTimestamp);
        }
    }

    /**
     * Starts the timelapse
     */
    start () {
        if (!this.isAnimatingPaused && !this.isDragging) {
            this.current = 0;
        }

        this.isAnimating = true;
        this.isAnimatingPaused = false;

        this.animate();
    }

    /**
     * Pauses the timelapse
     */
    pause () {
        this.isAnimatingPaused = true;
        clearTimeout(this.timeout);
    }

    /**
     * Stops the timelapse and resets the time to "live"
     */
    stop () {
        this.isAnimating = false;
        this.isAnimatingPaused = false;
        clearTimeout(this.timeout);
        this.setPercentUI(1);
        this.setTimestampUI(this.lastTimestamp);
        this.ctrl.map.updateData();
    }

    /**
     * Set the timelapse progress in percent.
     * @param {number} percent - A number between 0 and 1 representing the desired timelapse progress.
     */
    setPercent (percent) {
        this.current = Math.floor(((this.lastTimestamp - this.firstTimestamp) / this.timestampLength) * percent);

        this.start();
        this.pause();
        this.ctrl.scope.$apply();
    }

    /**
     * Returns true if timelapsing is available.
     * A timelapse is unavailable if there are less than 2 datapoints. This can happen if the timestampLength is larger than the total time period duration
     * @return {bool} - True if available, false if not.
     */
    isTimelapseAvailable () {
        this.ctrl.log('length: ' + this.timestampLength);
        this.ctrl.log('delta:' + (this.lastTimestamp - this.firstTimestamp));
        return this.timestampLength >= 0 && this.lastTimestamp - this.firstTimestamp >= this.timestampLength;
    }

    /**
     * The 'game loop' for updating the timelapse.
     * This function will start a timer that calls this function again, thereby creating the loop.
     */
    animate () {
        if (!this.isAnimating || this.isAnimatingPaused) return;

        // If we have reached the end of the timelapse.
        if (this.current * this.timestampLength + this.firstTimestamp >= this.lastTimestamp) {
            this.stop();
            this.ctrl.scope.$apply();
            return;
        }

        // Calculate the percentage for the new current timelapse position.
        var percent = (this.current / ((this.lastTimestamp - this.firstTimestamp) / this.timestampLength));
        this.setPercentUI(percent);

        // Calculate the timestamp for the new current timelapse position and print it on the screen.
        var timestamp = this.current * this.timestampLength + this.firstTimestamp;
        this.setTimestampUI(timestamp);

        this.ctrl.map.updateData();

        this.current += 1;

        // Update loop
        var self = this;
        this.timeout = setTimeout(() => {
            self.animate();
        }, animationStep);
    }

    /**
     * Set the percentage of the timlapse progress bar UI
     * @param {number} percent - Progress percentage between 0 and 1
     */
    setPercentUI (percent) {
        percent = Math.floor(percent * 100);
        $('#timelapse-progress-bar').css('width', percent + '%');
    }

    /**
     * Set the timestamp displayed in the timelapse UI
     * @param {number} timestamp - The desired timestamp in milliseconds
     */
    setTimestampUI (timestamp) {
        timestamp = moment.unix(timestamp / 1000).format('DD-MM-YYYY HH:mm:ss');
        $('#timelapse-timestamp').html(timestamp);
    }

    /**
     * Get the current datapoint index.
     * @return {number} - The index as an integer.
     */
    getCurrent () {
        return this.current;
    }
}
