/**
 * Factory object design pattern
 * Creates two different types of contents
 */
class FishEyeFactory {
    // Create a type of content (by passing a type argument)
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