import LocalStorage from '../utils/LocalStorage';
import getArraysExtremes from "../utils/getArraysExtremes";
import likesTextFormatter from "../utils/likesTextFormatter";


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
        this.indexCardsElementContainer = document.getElementsByClassName("cards-contents")[0];
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
        const mediaContainer = document.createElement("span");
        mediaContainer.classList.add("photo-container");

        const mediaPath = "./public/img/photographers/" + this.photographer.id + ".jpg";
        const photo = document.createElement("img");
        photo.src = mediaPath;
        photo.setAttribute("alt", "Photo de " + this.photographer.name);

        mediaContainer.appendChild(photo);
        blocPhotoContainer.appendChild(mediaContainer);


        headerInformation.appendChild(blocPhotoContainer);

        const headerInformationTown = document.getElementsByClassName("photographer__town")[0];
        headerInformationTown.textContent = this.photographer.city;
        const headerInformationTagline = document.getElementsByClassName("photographer__tagline")[0];
        headerInformationTagline.textContent = this.photographer.tagline;
    }


    /**
     * Render the photographers photos cards
     * @function
     * @memberof PhotographerPage  
     */
    renderPhotographersCards() {
        this.photographerMedias.forEach(photoObject => {

            const card = document.createElement("article");
            // Get the photo's name with path (last segment URL, remove extension, replce underscores by white spaces)
            const photoName = ((photoObject.path.substring(photoObject.path.lastIndexOf('/') + 1)).split('.').slice(0, -1).join('.')).replaceAll('_', ' ');
            card.setAttribute("aria-label", "Détails de la photo " + photoName + ", prise par " + this.photographer.name);
            card.setAttribute("vocab", "https://schema.org/");
            card.setAttribute("typeof", "Product");
            // card.classList.add("photoObject-card");
            const cardLink = document.createElement("a");
            cardLink.setAttribute("property", "url");
            cardLink.setAttribute("aria-label", "Lilac breasted roller, closeup view");
            cardLink.tabIndex = 0;
            // cardLink.href = "./photoObject.html";
            const preservedThis = this;
            cardLink.addEventListener("click", function() {
                // preservedThis.localStorage.setStorage("id", photoObject.id);
            }, true);


            if (photoObject.mediaType === "image") {
                // A photo
                const photo = document.createElement("img");
                photo.setAttribute("property", "image");
                photo.src = photoObject.path;
                photo.setAttribute("alt", photoObject.description);
                cardLink.appendChild(photo);
                card.appendChild(cardLink);
            } else {
                // A video
                const videoContainer = document.createElement("span");
                const video = document.createElement("video");
                video.setAttribute("property", "image");
                video.src = photoObject.path;
                video.setAttribute("alt", photoObject.description);
                video.textContent = "Your browser does not support the video tag."
                videoContainer.appendChild(video);
                cardLink.appendChild(videoContainer);
                card.appendChild(cardLink);
            }

            const titre = document.createElement("h2");
            titre.setAttribute("property", "name");
            titre.textContent = photoName;
            card.appendChild(titre);

            const textContainer = document.createElement("p");
            const texte1 = document.createElement("span");
            texte1.setAttribute("property", "availableAtOrFrom");
            texte1.classList.add("photo__numberOfLikes");
            const texte2 = document.createElement("span");
            texte2.classList.add("photo__likes");
            texte2.addEventListener("click", function() {
                // preservedThis.localStorage.setStorage("id", photoObject.id);
            }, true);
            texte1.textContent = likesTextFormatter(photoObject.likes, 0);
            textContainer.appendChild(texte1);
            textContainer.appendChild(texte2);
            card.appendChild(textContainer);

            this.indexCardsElementContainer.appendChild(card);
        });
    }
}