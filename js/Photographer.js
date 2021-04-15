/**
 * The photographer object
 */
export default class Photographer {

    constructor(objectContent) {
        this.name = objectContent.name;
        this.id = objectContent.id;
        this.city = objectContent.city;
        this.country = objectContent.country;
        this.tags = objectContent.tags;
        this.medias = [];
    }
    addMedia(media) {
        this.medias.push(media);
    }
    getMedias() {
        return this.medias;
    }
    getMediasAmount() {
        return this.medias.length;
    }
    isTaggedBy(tag) {
        return this.tags.includes(tag)
    }
}