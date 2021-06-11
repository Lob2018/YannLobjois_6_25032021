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
        this.initializeContactForm();
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
                    // Add captions (fictitious)
                let track = document.createElement("track");
                track.src = "./public/videos/videos_fr.vtt";
                track.kind = "captions";
                track.srclang = "fr";
                track.label = "French";
                video.appendChild(track);
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
            texte2.tabIndex = 0;
            texte2.setAttribute("role", "button");
            // Set the like color icon
            if (this.localStorage.getStorage("photo-" + photoObject.id) === null) {
                texte2.className = "photo__likes likes--black";
                texte2.setAttribute("aria-label", photoObject.likes + " likes");
                texte2.setAttribute("aria-pressed", "false");
            } else {
                texte2.className = "photo__likes likes--red";
                texte2.setAttribute("aria-label", photoObject.likes + " likes");
                texte2.setAttribute("aria-pressed", "true");
            }
            // Initialize the number of likes
            if (num === 0) {
                if (this.localStorage.getStorage("photo-" + photoObject.id) === null) {} else {
                    photoObject.likes = parseInt(photoObject.likes) + 1 + "";
                }
                texte1.textContent = likesTextFormatter(photoObject.likes, 0);
            } else texte1.textContent = likesTextFormatter(photoObject.likes, 0);
            // Like click listener
            texte2.addEventListener("click", function() {
                if (preservedThis.localStorage.getStorage("photo-" + photoObject.id) === null) {
                    preservedThis.localStorage.setStorage("photo-" + photoObject.id, "like");
                    photoObject.likes = parseInt(photoObject.likes) + 1 + "";
                    texte2.className = 'photo__likes likes--red';
                    texte2.setAttribute("aria-label", photoObject.likes + " likes");
                    texte2.setAttribute("aria-pressed", "true");
                } else {
                    preservedThis.localStorage.removeItem("photo-" + photoObject.id);
                    photoObject.likes = parseInt(photoObject.likes) - 1 + "";
                    texte2.className = 'photo__likes likes--black';
                    texte2.setAttribute("aria-label", photoObject.likes + " likes");
                    texte2.setAttribute("aria-pressed", "false");
                }
                texte1.textContent = likesTextFormatter(photoObject.likes, 0);
            }, true);
            // Like hit enter listener
            texte2.addEventListener("keyup", function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    texte2.click();
                }
            });
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

        if (num === 0) {
            // Add the data to the JSON array & render it
            this.data.offers.offers = offerJsonArray;
            this.renderSchemaJSONLD();
            // Filter by current likes
            this.filteredByLikes();
        }
        // Add the filter listener (1:popularité, 2:date, 3:titre)
        const preservedThis = this;
        // Store the HTML article elements        
        this.orderBy.addEventListener("change", function() {
            switch (this.value) {
                case "1":
                    preservedThis.filteredByLikes();
                    break;
                case "2":
                    preservedThis.filteredByDates();
                    break;
                case "3":
                    preservedThis.filteredByTitles();
                    break;
            }
        });
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
    filteredByDates() {
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
    filteredByTitles() {
        this.photographerMedias.sort((a, b) =>
            (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        document.getElementsByClassName("cards-contents")[0].innerHTML = "";
        this.renderPhotographersCards(3);
    }

    /**
     * Render the photographer's further informations
     * @function
     * @memberof PhotographerPage 
     */
    renderPhotographersFurtherInformations() {
        const main = document.getElementsByTagName("MAIN")[0];
        const container = document.createElement("ASIDE");
        container.setAttribute("aria-label", "Additional information about the photographer");
        const numberOfLikes = document.createElement("span");
        numberOfLikes.textContent = "297 081";
        const symbolOfLikes = document.createElement("span");
        symbolOfLikes.classList.add("aside__symbolOfLikes");
        const remuneration = document.createElement("span");
        remuneration.classList.add("aside__remuneration");
        remuneration.textContent = this.photographer.price + "€ / jour"

        // card.setAttribute("aria-label", "Détails de la photo " + photoObject.name + ", prise par " + this.photographer.name);
        // const cardLink = document.createElement("a");
        container.appendChild(numberOfLikes);
        container.appendChild(symbolOfLikes);
        container.appendChild(remuneration);
        main.appendChild(container);
    }

    /**
     * Initialize the contact form
     * @function
     * @memberof PhotographerPage  
     */
    initializeContactForm() {
        // Get the form and his fields
        this.form = document.forms[1];
        this.formInputs = [
            document.getElementById('prenom'),
            document.getElementById('nom'),
            document.getElementById('mail'),
            document.getElementById('yourMessage')
        ];
        // Set the form's title
        const formTitle = document.getElementById('form__title');
        formTitle.setAttribute('style', 'white-space: pre;');
        formTitle.setAttribute('aria-label', 'Contactez moi ' + this.photographer.name);
        formTitle.textContent = "Contactez moi\r\n" + this.photographer.name;
        // Get the HTML's form elements
        this.modalbg = document.getElementsByClassName("bground")[0];
        this.modalbg.setAttribute("aria-hidden", "true");
        const modalBtn = document.getElementsByClassName("modal-btn")[0];
        this.formData = document.getElementsByClassName("formData")[0];
        this.modalBtnClose = document.getElementsByClassName("close")[0];
        document.getElementsByClassName("close")[0].tabIndex = 0;
        // Like hit enter listener
        document.getElementsByClassName("close")[0].addEventListener("keyup", function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementsByClassName("close")[0].click();
            }
        });
        // launch modal event
        const preservedThis = this;
        modalBtn.addEventListener("click",
            function() {
                preservedThis.form.reset();
                preservedThis.modalbg.style.display = "block";
                // Update the aria visibility
                document.getElementsByClassName("photographer--main")[0].setAttribute("aria-hidden", "true");
                document.getElementsByClassName("bground")[0].setAttribute("aria-hidden", "false");
                document.getElementById("prenom").focus();
            });
        // close modal event
        this.modalBtnClose.addEventListener("click", function() {
            preservedThis.modalbg.style.display = "none";
            // Update the  aria visibility
            document.getElementsByClassName("photographer--main")[0].setAttribute("aria-hidden", "false");
            document.getElementsByClassName("bground")[0].setAttribute("aria-hidden", "true");
            document.getElementsByClassName("photographer--main")[0].focus();
        });
        // inputs text listeners (invalid and blur)
        for (let i = 0; i < this.formInputs.length; i++) {
            this.formInputs[i].addEventListener('invalid', function(event) {
                event.preventDefault();
                preservedThis.checkInputsErrors(preservedThis.formInputs[i]);
                preservedThis.validate();
            });
            this.formInputs[i].addEventListener('blur', function() {
                preservedThis.checkInputsErrors(preservedThis.formInputs[i]);
            });
        }
        // the form submit listener
        this.form.addEventListener("submit", function(event) {
            event.preventDefault();
            preservedThis.validate();
        });
    }

    /**
     *  Check the contact form inputs errors with the listeners
     * @param {object} el - The input element
     */
    checkInputsErrors(el) {
        if (el.validity.valid) {
            el.parentElement.setAttribute("data-error-visible", "false");
        } else {
            el.parentElement.setAttribute("data-error-visible", "true");
        }
    }

    /**
     * The contact form validation 
     * @returns {boolean} - TRUE the form been sent, FALSE it contain errors
     */
    validate() {
        // Check all text inputs error
        let validInputs = true;
        for (let input of this.formInputs) {
            if (!input.validity.valid) validInputs = false;
        }
        // If it's ok send the form and close the form modal
        if (validInputs) {
            const formData = new FormData(this.form);
            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            this.modalbg.style.display = "none";
            return true;
        } else return false;
    }

}