import LocalStorage from '../utils/LocalStorage';
import getArraysExtremes from "../utils/getArraysExtremes";


export default class PhotographerPage {
    /**
     * Classe PhotographerPage - The photographer's page
     * @class PhotographerPage
     * @param {object} photographer - The photographer's object
     */
    constructor(photographer) {
        this.photographer = photographer;
        this.photographerMedias = this.photographer.medias;
        this.indexPhotographersTagLinks = document.getElementsByClassName("photographer-categories")[0];
        this.indexCardsElementContainer = document.getElementsByClassName("cards-photographs")[0];
        this.photographersTagsToFilter = [];
        this.localStorage = new LocalStorage();
    }

    /**
     * Photographers page : Create the clickable tags list in the header
     * @function
     * @memberof PhotographerPage  
     */
    renderPhotographerTags() {
        this.photographer.tags.forEach(tag => {
            const tagLink = document.createElement("A");
            tagLink.setAttribute("role", "menuitem");
            tagLink.tabIndex = 0;
            tagLink.textContent = "#" + tag.charAt(0).toUpperCase() + tag.slice(1);
            this.indexPhotographersTagLinks.appendChild(this.tagLoopFactorization(tag, tagLink));
        });
    }

    /**
     * Tag loop factorization (listener, add li, return list)
     * @function
     * @memberof PhotographerPage  
     * @param {string} tag - The tag
     * @param {object} tagLink - The HTML tag link
     * @returns {object} - The HTML tags list
     */
    tagLoopFactorization(tag, tagLink) {
        const preservedThis = this;
        tagLink.addEventListener("click", function() {
            preservedThis.localStorage.setStorage("tag", tag);
            window.location.href = "./index.html";
        }, true);
        const tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);
        return tagList;
    }

    /**
     * Photographers page : Add web semantics in the head of HTML in JSON-LD format
     * @function
     * @memberof PhotographerPage  
     */
    renderSchemaJSONLD() {
        // Add web semantic
        const schemaElement = document.getElementById("dynamicJSONLD");
        schemaElement.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Freelance photographer",
            "provider": {
                "@type": "Person",
                "name": this.photographer.name,
            },
            "offers": {
                "@type": "Offer",
                "description": "Achievements price in euros",
                "itemOffered": {
                    "@type": "AggregateOffer",
                    "highPrice": getArraysExtremes(this.photographerMedias, "price", "max"),
                    "lowPrice": getArraysExtremes(this.photographerMedias, "price", "min"),
                    "offerCount": this.photographerMedias.length
                }
            }
        });
    }

    /**
     * Render the header information
     * @function
     * @memberof PhotographerPage  
     */
    renderHeaderInformation() {
        const titleH1 = document.getElementsByClassName("photographer__h1")[0];
        titleH1.textContent = this.photographer.name;

        const headerInformation = document.getElementsByClassName("header__info--photographer")[0];

        const blocPhotoContainer = document.createElement("div");
        blocPhotoContainer.classList.add("bloc-photo-container");
        const photoContainer = document.createElement("span");
        photoContainer.classList.add("photo-container");

        const photoJGP = "./public/img/photographers/" + this.photographer.id + ".jpg";
        const photo = document.createElement("img");
        photo.src = photoJGP;
        photo.setAttribute("alt", "Photo de " + this.photographer.name);

        photoContainer.appendChild(photo);
        blocPhotoContainer.appendChild(photoContainer);


        headerInformation.appendChild(blocPhotoContainer);

        const headerInformationTown = document.getElementsByClassName("photographer__town")[0];
        headerInformationTown.textContent = this.photographer.city;
        const headerInformationTagline = document.getElementsByClassName("photographer__tagline")[0];
        headerInformationTagline.textContent = this.photographer.tagline;
    }

}