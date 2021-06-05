/**
 * Format the number of likes
 * @module
 * @param {number} num - The number of likes
 * @param {number} digits - The desired digits to diplay
 * @returns {string} - The formatted number of likes
 */
export default function(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    //  \. for the separator, * 0 for 0 or more, + for one or more
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    // Find if there is a lookup
    var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    // Return likes with symbol or nothing ($1 divide the number by value, put to fixed number, remove leading zeros ($1 for the first () in the regex))
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}