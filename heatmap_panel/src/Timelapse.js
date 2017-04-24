import angular from 'angular';

export default class Timelapse {
  constructor (ctrl, angularInterval) {
    this.$interval = angularInterval;
    this.ctrl = ctrl;
    this.state = 'stop';
    this.index = 0;
    this.range = 0;
    this.step = 1;
    this.dataList = []; // Is updated in onRender()
    this.mInterval = undefined;
  }

  onPlay () {
    if (this.state === 'pause' && this.range >= 100) {
      this.range = 0;
      this.index = 0;
    }
    this.state = 'play';
    this.playTimelapse();
  }

  onPause () {
    this.cancelTimelapse();
    this.state = 'pause';
    this.index--;
  }

  playTimelapse () {
    this.ctrl.circles.drawCircles(this.dataList, this.index);
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
          context.range = 100;
          context.state = 'pause';
        } else if (context.state === 'pause') {
          context.index--;
        }
      } else {
        context.ctrl.circles.drawCircles(context.dataList, context.index);
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

  cancelTimelapse () {
    this.$interval.cancel(this.mInterval);
    this.mInterval = undefined;
  }

  onStop () {
    this.cancelTimelapse();
    this.state = 'stop';
    this.index = 0;
    this.range = 0;
    this.ctrl.onDataReceived(this.ctrl.currentDataList);
  }

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
    }
  }
}
