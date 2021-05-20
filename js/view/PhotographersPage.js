import LocalStorage from '../utils/LocalStorage';
import getArraysExtremes from "../utils/getArraysExtremes";

/**
 * The photographer's page
 */
export default class PhotographerPage {
    /**
     * Photographers page : Add web semantics in the head of HTML in JSON-LD format
     */
    renderSchemaJSONLD() {
        // Get the Photograph with the stored id value
        if (this.photograph === undefined) this.photograph = this.photographers.filter(p => p.id === parseInt(this.localStorage.getStorage("id"), 10))[0];
        // Get the lowest and the highest achievements's prices
        const photographerMedias = this.photograph.medias;
        const photosHighestPrice = getArraysExtremes(photographerMedias, "price", "max");
        const photoLowestPrice = getArraysExtremes(photographerMedias, "price", "min");
        // Add web semantic
        const schemaElement = document.getElementById("dynamicJSONLD");
        schemaElement.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Freelance photographer",
            "provider": {
                "@type": "Person",
                "name": this.photograph.name,
            },
            "offers": {
                "@type": "Offer",
                "description": "Achievements price in euros",
                "itemOffered": {
                    "@type": "AggregateOffer",
                    "highPrice": photosHighestPrice,
                    "lowPrice": photoLowestPrice,
                    "offerCount": this.photograph.medias.length
                }
            }
        });
    }
}