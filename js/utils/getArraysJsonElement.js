/**
 * Get the filtered object with his value, from an array of objects
 * @param {array} array 
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
export default function(array, key, value) {
    return array.filter(function(obj) {
        if (obj[key] == value) return obj;
    })
}