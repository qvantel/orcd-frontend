import angular from 'angular';

/** Class for handling timelapse logic */
export default class Timelapse {
  constructor (ctrl, angularInterval) {
    this.$interval = angularInterval;
    this.ctrl = ctrl;
    this.state = 'stop';
    this.index = 0;
    this.range = 0;
    this.step = 1;
    this.time = 0;
    this.dataList = []; // Is updated in onRender()
    this.mInterval = undefined;
  }

  /** When play is pressed */
  onPlay () {
    if (this.state === 'pause' && this.range >= 100) {
      this.range = 0;
      this.index = 0;
    }
    this.state = 'play';
    this.playTimelapse();
  }

  /** When pause is pressed */
  onPause () {
    this.cancelTimelapse();
    this.state = 'pause';
    this.index--;
  }

  /** Plays the time interval */
  playTimelapse () {
    this.ctrl.circles.drawCircles(this.dataList, this.index);
    this.time = new Date(this.dataList[0].datapoints[this.index][1]).toLocaleString();
    var context = this;
    this.index++;

    if (angular.isDefined(this.mInterval)) { // Don't start new interval if it's already started.
      return;
    }
    this.mInterval = context.$interval(play, 1500);

    function play () {
      if (context.state !== 'play') {
        context.cancelTimelapse();
        if (context.state === 'end') {
          context.ctrl.circles.drawCircles(context.dataList, context.index);
          context.time = new Date(context.dataList[0].datapoints[context.index][1]).toLocaleString();
          context.range = 100;
          context.state = 'pause';
        } else if (context.state === 'pause') {
          context.index--;
        }
      } else {
        context.ctrl.circles.drawCircles(context.dataList, context.index);
        context.time = new Date(context.dataList[0].datapoints[context.index][1]).toLocaleString();
        if (context.index < context.dataList[0].datapoints.length - 2) {
          context.range = context.index * context.step;
          context.index++;
        } else {
          context.range = context.index * context.step;
          context.index++;
          context.state = 'end';
        }
      }
    }
  }

  /** Stop and cancel the running interval */
  cancelTimelapse () {
    this.$interval.cancel(this.mInterval);
    this.mInterval = undefined;
  }

  /** When stop is pressed */
  onStop () {
    this.cancelTimelapse();
    this.state = 'stop';
    this.index = 0;
    this.range = 0;
    this.ctrl.onDataReceived(this.ctrl.currentDataList);
  }

  /** Sets range for where in time interval to render */
  setTimelapseRange () {
    let i = 0;
    while (((this.step / 2) * i) < this.range) {
      i++;
    }

    if (i % 2 === 0) {
      this.index = (i / 2);
      this.range = this.index * this.step;
    } else {
      this.index = Math.floor(i / 2);
      this.range = this.index * this.step;
    }

    if (this.state === 'play') {
      this.playTimelapse();
    } else {
      this.ctrl.circles.drawCircles(this.dataList, this.index);
      this.time = new Date(this.dataList[0].datapoints[this.index][1]).toLocaleString();
    }
  }
}
