/**
 * Get the max or min from an array with an accumulator of callback's return value
 * @module
 * @param {array} array - The array 
 * @param {string} value - The property to sort 
 * @param {string} type - The type of filter (max or min)
 * @returns {number} - The maximum or minimum corresponding value
 */
export default function(array, value, type) {
    if (type === "max") {
        return array.reduce(
            (max, element) => (element[value] > max ? element[value] : max),
            array[0][value]);
    } else {
        return array.reduce(
            (min, element) => (element[value] < min ? element[value] : min),
            array[0][value]);
    }
}