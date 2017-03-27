/** This class will be responsible for inputs */
export default class Map {
    /**
    * Build the inputManager and set some initiate variables
    */
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.ctrlKeyDown = false;
    }

    /**
    * Bind events
    */
    bindEvents () {
        var self = this;

        $(window).keydown((e) => {
            if (e.ctrlKey) {
                self.ctrlKeyDown = true;
            }
        });

        $(window).keyup((e) => {
            if (e.ctrlKey) {
                self.ctrlKeyDown = false;
            }
        });
    }

    /**
    * Check if the ctrl-key is pressed
    */
    isCtrlDown () {
        return this.ctrlKeyDown;
    }
}
