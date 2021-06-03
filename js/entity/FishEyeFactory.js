import Photographer from './Photographer.js';
import Media from './Media.js';

export default class FishEyeFactory {
    /**
     * Classe FishEyeFactory - Creates two different types of contents - Factory object design pattern
     * @class FishEyeFactory
     */

    /**
     * Create a type of content (by passing a type argument)
     * @function
     * @memberof FishEyeFactory   
     * @param {string} type - The type of content
     * @param {object} objectContent  - The data content
     * @returns {object} - Photographer or Media
     */
    createPhotography(type, objectContent) {
        var content;
        if (type === "photographer") {
            content = new Photographer(objectContent);
        } else if (type === "media") {
            content = new Media(objectContent);
        }
        content.type = type;
        return content;
    }
}