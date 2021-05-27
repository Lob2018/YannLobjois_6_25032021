/**
 * The media object
 */
export default class Media {
    /**
     * @param {object} objectContent - The JSON media data
     */
    constructor(objectContent) {
        this.id = objectContent.id;
        this.photographerId = objectContent.photographerId;
        if (objectContent.image === undefined) {
            this.mediaType = "video";
            this.path = "./public/videos/" + objectContent.video;
        } else {
            this.mediaType = "image";
            this.path = "./public/img/" + objectContent.image;
        }
        this.tags = objectContent.tags;
        this.likes = objectContent.likes;
        this.date = objectContent.date;
        this.price = objectContent.price;
        this.description = objectContent.description;
    }
}