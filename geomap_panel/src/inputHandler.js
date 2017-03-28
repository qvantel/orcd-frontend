/** This class will be responsible for inputs */
export default class Map {
    /**
    * Build the inputManager and set some initiate variables
    */
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.ctrlKeyDown = false;
        this.shiftKeyDown = false;
        this.bindEvents();
    }

    /**
    * Bind events
    */
    bindEvents () {
        var self = this;

        $(window).keydown((e) => {
            self.ctrlKeyDown = e.ctrlKey;
            self.shiftKeyDown = e.shiftKey;
        });

        $(window).keyup((e) => {
            self.ctrlKeyDown = e.ctrlKey;
            self.shiftKeyDown = e.shiftKey;
        });
    }

    /**
    * Check if the shift-key is pressed
    */
    isShiftDown () {
        return this.shiftKeyDown;
    }

    /**
    * Check if the ctrl-key is pressed
    */
    isCtrlDown () {
        return this.ctrlKeyDown;
    }
}
