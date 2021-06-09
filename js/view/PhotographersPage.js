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
        this.orderBy = document.getElementById("orderBy");
        this.filteredHTMLarticles = [];

        // Get the ids filtered by likes (default)
        this.idFilteredByLikes = [];
        this.photographerMedias.sort(function(a, b) {
            return b.likes - a.likes;
        });

        // For the JSON-LD
        this.data = {
            "@context": "https://schema.org",
            "@type": "Product",
            "serviceType": "Media",
            "provider": {
                "@type": "Person",
                "name": this.photographer.name,
            },
            "offers": {
                "@type": "Offer",
                "description": "Achievements price in euros",
                "itemOffered": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "highPrice": getArraysExtremes(this.photographerMedias, "price", "max"),
                    "lowPrice": getArraysExtremes(this.photographerMedias, "price", "min"),
                    "offerCount": this.photographerMedias.length,
                    "offers": []
                }
            }
        };
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
        const schemaElement = document.createElement("script");
        schemaElement.type = "application/ld+json";
        schemaElement.innerHTML = JSON.stringify(this.data)
        document.getElementsByTagName('head')[0].appendChild(schemaElement);
    }

    /**
     * Render the header information
     * @function
     * @memberof PhotographerPage  
     */
    renderHeaderInformation() {
        const titleH1 = document.getElementsByClassName("photographer__h1")[0];
        titleH1.textContent = this.photographer.name;
        const headerInformation = document.getElementsByClassName("main__info--photographer")[0];
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
        headerInformationTown.textContent = this.photographer.city + ", " + this.photographer.country;
        const headerInformationTagline = document.getElementsByClassName("photographer__tagline")[0];
        headerInformationTagline.textContent = this.photographer.tagline;
    }

    /**
     * Render the photographers photos cards
     * @function
     * @memberof PhotographerPage  
     * @param {number} num - The number of the selected filter (initialized with 0)
     */
    renderPhotographersCards(num) {
        const offerJsonArray = [];
        this.photographerMedias.forEach(photoObject => {
            const preservedThis = this;
            const card = document.createElement("article");
            card.setAttribute("data-id", photoObject.id);
            card.setAttribute("aria-label", "Détails de la photo " + photoObject.name + ", prise par " + this.photographer.name);
            const cardLink = document.createElement("a");
            cardLink.setAttribute("aria-label", "Lilac breasted roller, closeup view");
            cardLink.tabIndex = 0;
            cardLink.addEventListener("click", function() {
                // preservedThis.localStorage.setStorage("id", photoObject.id);
            }, true);
            if (photoObject.mediaType === "image") {
                // A photo
                const photo = document.createElement("img");
                photo.src = photoObject.path;
                photo.setAttribute("alt", photoObject.description);
                cardLink.appendChild(photo);
                card.appendChild(cardLink);
            } else {
                // A video
                const videoContainer = document.createElement("span");
                const video = document.createElement("video");
                video.src = photoObject.path;
                video.setAttribute("alt", photoObject.description);
                video.textContent = "Your browser does not support the video tag."
                videoContainer.appendChild(video);
                cardLink.appendChild(videoContainer);
                card.appendChild(cardLink);
            }
            const titre = document.createElement("h2");
            titre.textContent = photoObject.name;
            card.appendChild(titre);
            const textContainer = document.createElement("p");
            const texte1 = document.createElement("span");
            texte1.classList.add("photo__numberOfLikes");
            const texte2 = document.createElement("span");
            texte2.classList.add("photo__likes");
            texte2.addEventListener("click", function() {
                preservedThis.setLikes(preservedThis, photoObject, texte1)
            }, true);
            if (num === 0) {
                this.getLikes(preservedThis, photoObject, texte1)
            } else texte1.textContent = likesTextFormatter(photoObject.likes, 0);
            textContainer.appendChild(texte1);
            textContainer.appendChild(texte2);
            card.appendChild(textContainer);
            this.indexCardsElementContainer.appendChild(card);
            // For the JSONLD

            offerJsonArray.push({
                "@type": "Offer",
                "name": photoObject.name,
                "image": photoObject.path,
                "description": photoObject.description,
                "priceCurrency": "EUR",
                "price": photoObject.price + "€"
            });

        });
        // Add the data to the JSON array & render it
        this.data.offers.offers = offerJsonArray;
        if (num === 0) this.renderSchemaJSONLD();
        // Add the filter listener (1:popularité, 2:date, 3:titre)
        const preservedThis = this;
        // Store the HTML article elements        
        this.orderBy.addEventListener("change", function() {
            switch (this.value) {
                case "1":
                    preservedThis.filteredByLikes();
                    break;
                case "2":
                    preservedThis.filterByDates();
                    break;
                case "3":
                    preservedThis.filterByTitles();
                    break;
            }
        });
    }

    /**
     * Set the numbre of likes on click (like or unlike)
     * @function
     * @memberof PhotographerPage  
     * @param {object} preservedThis 
     * @param {object} photoObject 
     * @param {object} texte1 
     */
    setLikes(preservedThis, photoObject, texte1) {
        if (preservedThis.localStorage.getStorage(photoObject.id) === null) {
            preservedThis.localStorage.setStorage(photoObject.id, "like");
            photoObject.likes = parseInt(photoObject.likes) + 1 + "";
        } else {
            preservedThis.localStorage.removeItem(photoObject.id);
            photoObject.likes = parseInt(photoObject.likes) - 1 + "";
        }
        texte1.textContent = likesTextFormatter(photoObject.likes, 0);
    }

    /**
     * Get the number of likes for the photos
     * @function
     * @memberof PhotographerPage  
     * @param {object} preservedThis 
     * @param {object} photoObject 
     * @param {object} texte1 
     */
    getLikes(preservedThis, photoObject, texte1) {
        if (preservedThis.localStorage.getStorage(photoObject.id) === null) {} else {
            photoObject.likes = parseInt(photoObject.likes) + 1 + "";
        }
        texte1.textContent = likesTextFormatter(photoObject.likes, 0);
    }

    /**
     * Get the ids filtered by likes
     * @function
     * @memberof PhotographerPage  
     */
    filteredByLikes() {
        this.photographerMedias.sort(function(a, b) {
            return b.likes - a.likes;
        });
        document.getElementsByClassName("cards-contents")[0].innerHTML = "";
        this.renderPhotographersCards(1);
    }

    /**
     * Get the ids filtered by date
     * @function
     * @memberof PhotographerPage  
     */
    filterByDates() {
        this.photographerMedias.sort((a, b) =>
            (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
        document.getElementsByClassName("cards-contents")[0].innerHTML = "";
        this.renderPhotographersCards(2);
    }

    /**
     * Get the ids filtered by title
     * @function
     * @memberof PhotographerPage  
     */
    filterByTitles() {
        this.photographerMedias.sort((a, b) =>
            (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        document.getElementsByClassName("cards-contents")[0].innerHTML = "";
        this.renderPhotographersCards(3);
    }


}