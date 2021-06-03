export default class LocalStorage {
    static instance;
    /**
     * Classe LocalStorage - Interact with the local storage - Singleton design pattern
     * @class LocalStorage
     * @returns {object} - The current LocalStorage instance
     */
    constructor() {
        if (LocalStorage.instance) {
            return LocalStorage.instance;
        }
        LocalStorage.instance = this;
    }

    /**
     * Get the value of item from the local storage
     * @function
     * @memberof LocalStorage  
     * @param {string} item - The item in the storage
     * @returns - The value stored
     */
    getStorage(item) {
        return localStorage.getItem(item);
    }

    /**
     * Set an item value in the local storage
     * @function
     * @memberof LocalStorage  
     * @param {string} item - The item to store
     * @param {string} value - The item value to store
     */
    setStorage(item, value) {
        localStorage.setItem(item, value);
    }

    /**
     * Remove an item from the local storage
     * @function
     * @memberof LocalStorage  
     * @param {string} item - The item to remove
     */
    removeItem(item) {
        localStorage.removeItem(item);
    }

    /**
     * Remove all items in the local storage
     * @function
     * @memberof LocalStorage  
     */
    clear() {
        localStorage.clear();
    }
}