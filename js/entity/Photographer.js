/**
 * The photographer object
 */
export default class Photographer {
    /**
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
         * @param {Object} media - The JSON media data
         */
    addMedia(media) {
            this.medias.push(media);
        }
        /**
         * Get all the photographer media
         * @returns {array} - The media array
         */
    getMedias() {
            return this.medias;
        }
        /**
         * Get the number of media
         * @returns {number} - The number of media
         */
    getMediasAmount() {
            return this.medias.length;
        }
        /**
         * Is it a photograph tag
         * @param {string} tag - A tag
         * @returns {boolean} - Is photographer tag
         */
    isTaggedBy(tag) {
        return this.tags.includes(tag)
    }
}