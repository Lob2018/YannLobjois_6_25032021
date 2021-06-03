export default class Photographer {
    /**
     * Classe Photographer - The photographer object
     * @class Photographer
     * @param {object} objectContent - The JSON photographer data
     */
    constructor(objectContent) {
        this.name = objectContent.name;
        this.id = objectContent.id;
        this.city = objectContent.city;
        this.country = objectContent.country;
        this.tags = objectContent.tags;
        this.tagline = objectContent.tagline
        this.price = objectContent.price
        this.portrait = objectContent.portrait
        this.medias = [];
    }

    /**
     * Add the photographer's media
     * @function
     * @memberof Photographer  
     * @param {Object} media - The JSON media data
     */
    addMedia(media) {
        this.medias.push(media);
    }

    /**
     * Get all the photographer media
     * @function
     * @memberof Photographer  
     * @returns {array} - The media array
     */
    getMedias() {
        return this.medias;
    }

    /**
     * Get the number of media
     * @function
     * @memberof Photographer  
     * @returns {number} - The number of media
     */
    getMediasAmount() {
        return this.medias.length;
    }

    /**
     * Is it a photograph tag
     * @function
     * @memberof Photographer  
     * @param {string} tag - A tag
     * @returns {boolean} - Is photographer tag
     */
    isTaggedBy(tag) {
        return this.tags.includes(tag)
    }
}