/** This class will hold basic functions */
export default class Utilities {
    /**
    * Clamp a value
    *
    * @param {number} val - The value to be clamped
    * @param {number} min - The min value
    * @param {number} max - The max value
    * @return {number} - The clamped value
    */
    clamp (val, min, max) {
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }

    /**
    * Clamp a value between 0 and 1
    *
    * @param {number} val - The value to be clamped
    * @return {number} - The clamped value
    */
    clamp01 (val) {
        return this.clamp(val, 0, 1);
    }

    /**
    * Get the absolute value
    *
    * @param {number} val - The value to be absoluted
    * @return {number} - The absolute value
    */
    abs (val) {
        if (val < 0) return val * -1;
        return val;
    }
}
