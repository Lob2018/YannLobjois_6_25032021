export default class Media {
    /**
     * Classe Media - The media object
     * @class Media
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
        // Get the photo's name with path (last segment URL, remove extension, replce underscores by white spaces)
        this.name = ((this.path.substring(this.path.lastIndexOf('/') + 1)).split('.').slice(0, -1).join('.')).replaceAll('_', ' ');
    }
}