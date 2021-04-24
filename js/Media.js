/**
 * The media object
 */
export default class Media {
    constructor(objectContent) {
        this.id = objectContent.id;
        this.photographerId = objectContent.photographerId;
        if (objectContent.image === undefined) {
            this.mediaType = "video";
            this.path = "./videos/" + objectContent.video;
        } else {
            this.mediaType = "image";
            this.path = "./img/" + objectContent.image;
        }
        this.tags = objectContent.tags;
        this.likes = objectContent.likes;
        this.date = objectContent.date;
        this.price = objectContent.price;
        this.description = objectContent.description;
    }
    like() {
        // Local storage add or remove
    }
}