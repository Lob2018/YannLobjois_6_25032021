/**
 * The media object
 */
class Media {
    constructor(objectContent) {
        this.id = objectContent.id;
        this.photographerId = objectContent.photographerId;
        this.tags = objectContent.tags;
        if (objectContent.image === undefined) {
            this.mediaType = "video";
            this.video = "./videos/" + objectContent.video;
        } else {
            this.mediaType = "image";
            this.image = "./img/" + objectContent.image;
        }
        this.like = 0;
    }
    addALike() {
        this.like++;
    }
}