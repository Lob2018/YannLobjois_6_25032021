import LocalStorage from '../utils/LocalStorage';
import getArraysExtremes from "../utils/getArraysExtremes";

/**
 * The home page
 */
export default class HomePage {
    /**
     * @param {array} theTags - The tags array
     * @param {array} photographers - The photographers array
     * @param {string} photographsHighPrice - The most expensive photographer
     * @param {string} photographsLowPrice - The cheapest photographer 
     */
    constructor(theTags, photographers, photographsHighPrice, photographsLowPrice) {
        this.theTags = theTags;
        this.photographers = photographers;
        this.indexPhotographersTagLinks = document.getElementsByClassName("index-categories")[0];
        this.indexCardsElementContainer = document.getElementsByClassName("cards-photographs")[0];
        this.photographsHighPrice = photographsHighPrice;
        this.photographsLowPrice = photographsLowPrice;
        this.photographersTagsToFilter = [];
        this.localStorage = new LocalStorage();
    }

    /**
     * Home page : Create the clickable tags list in the header
     */
    renderGlobalTags() {
        this.theTags.forEach(tag => {
            const tagLink = document.createElement("A");
            tagLink.setAttribute("role", "menuitem");
            tagLink.tabIndex = 0;
            tagLink.textContent = "#" + tag.charAt(0).toUpperCase() + tag.slice(1);
            this.indexPhotographersTagLinks.appendChild(this.tagLoopFactorization(tag, tagLink));
        });
    }

    /**
     * Tag loop factorization (listener, add li, return list)
     * @param {string} tag - The tag
     * @param {object} tagLink - The HTML tag link
     * @returns {object} - The HTML tags list
     */
    tagLoopFactorization(tag, tagLink) {
        const preservedThis = this;
        tagLink.addEventListener("click", function() {
            preservedThis.renderPhotographersCards(tag);
        }, true);
        const tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);
        return tagList;
    }


    /**
     * Home page : Add web semantics in the head of HTML in JSON-LD format
     */
    renderSchemaJSONLD() {
            const schemaElement = document.getElementById("dynamicJSONLD");
            schemaElement.text = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Freelance photographers website",
                "provider": {
                    "@type": "Organization",
                    "legalName": "FishEye",
                    "logo": "./img/logo/FishEye.png"
                },
                "offers": {
                    "@type": "Offer",
                    "description": "Photographers rates in Euros",
                    "itemOffered": {
                        "@type": "AggregateOffer",
                        "highPrice": this.photographsHighPrice + "EUR",
                        "lowPrice": this.photographsLowPrice + "EUR",
                        "offerCount": this.photographers.length
                    },
                }
            });
        }
        /**
         * Render the photographers cards
         * @param {string} tag - The tag to render
         */
    renderPhotographersCards(tag) {
        if (tag === "") {
            this.photographers.forEach(photographer => {
                const card = document.createElement("article");
                card.setAttribute("aria-label", "Présentation de " + photographer.name);
                card.classList.add("photographer-card");
                const cardLink = document.createElement("a");
                cardLink.setAttribute("aria-label", "Page de " + photographer.name);
                cardLink.tabIndex = 0;
                cardLink.href = "./photographer.html";
                const preservedThis = this;
                cardLink.addEventListener("click", function() {
                    preservedThis.localStorage.setStorage("id", photographer.id);
                }, true);
                const photoJGP = "./img/photographers/" + photographer.id + ".jpg";
                const photoContainer = document.createElement("picture");
                photoContainer.style.backgroundImage = "url('" + photoJGP + "')";
                const photo = document.createElement("img");
                photo.src = photoJGP;
                photo.setAttribute("alt", "Photo de " + photographer.name);
                photoContainer.appendChild(photo);
                cardLink.appendChild(photoContainer);
                const titre = document.createElement("h2");
                titre.textContent = photographer.name;
                cardLink.appendChild(titre);
                card.appendChild(cardLink);
                const texte = document.createElement("P");
                const texte1 = document.createElement("span");
                const texte1CR = document.createElement("br");
                const texte2 = document.createElement("span");
                const texte2CR = document.createElement("br");
                const texte3 = document.createElement("span");
                texte1.textContent = photographer.city + ", " + photographer.country;
                texte2.textContent = photographer.tagline;
                texte3.textContent = photographer.price + "€/jour";
                texte.appendChild(texte1);
                texte.appendChild(texte1CR);
                texte.appendChild(texte2);
                texte.appendChild(texte2CR);
                texte.appendChild(texte3);
                card.appendChild(texte);
                const tags = document.createElement("ul");
                tags.classList.add("index-categories");
                tags.classList.add("index-photographer-categories");
                tags.setAttribute("role", "menubar");
                tags.setAttribute("aria-label", "photographer categories");
                photographer.tags.forEach(tag => {
                    const tagLink = document.createElement("A");
                    tagLink.setAttribute("role", "menuitem");
                    tagLink.tabIndex = 0;
                    tagLink.textContent = "#" + tag;
                    tags.appendChild(this.tagLoopFactorization(tag, tagLink));
                });
                card.appendChild(tags);
                this.indexCardsElementContainer.appendChild(card);
            });
        } else if (tag === "*") {
            Array.prototype.forEach.call(this.indexCardsElementContainer.getElementsByTagName("article"), function(htmlElementArticle) {
                htmlElementArticle.style.display = "block";
            });
        } else {
            let preservedThis = this;
            // Filter the photographers with one tag
            Array.prototype.forEach.call(this.indexCardsElementContainer.getElementsByTagName("article"), function(htmlElementArticle) {
                preservedThis.photographersTagsToFilter = htmlElementArticle.getElementsByTagName("A");
                for (let i = 0; i < preservedThis.photographersTagsToFilter.length; i++) {
                    if (("#" + tag) == preservedThis.photographersTagsToFilter[i].textContent) {
                        htmlElementArticle.style.display = "block";
                        break;
                    } else {
                        htmlElementArticle.style.display = "none";
                    }
                }
            });
        }
    }
}