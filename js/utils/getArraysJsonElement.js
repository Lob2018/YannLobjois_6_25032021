/**
 * Get the filtered object with his value, from an array of objects
 * @module
 * @param {array} array 
 * @param {string} key 
 * @param {string} value 
 * @returns {object} - The corresponding object
 */
export default function(array, key, value) {
    return array.filter(function(obj) {
        if (obj[key] == value) return obj;
    })
}