import LocalStorage from '../utils/LocalStorage';

export default class HomePage {
    /**
     * Classe HomePage - The home page
     * @class HomePage
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
        this.photographersTagsToFilter = [];
        this.localStorage = new LocalStorage();
        // For the JSON-LD
        this.data = {
            "@context": "https://schema.org/",
            "@type": "Offer",
            "name": "FishEye",
            "url": "",
            "image": "",
            "description": "Freelance photographers",
            "price": "",
            "priceCurrency": "EUR",
            "seller": {
                "@type": "Organization",
                "name": "FishEye",
                "logo": "https://lob2018.github.io/YannLobjois_6_25032021/public/img/logo/FishEye.svg",
                "url": "https://lob2018.github.io/YannLobjois_6_25032021/index.html"
            },
            "offers": {
                "@type": "AggregateOffer",
                "highPrice": photographsHighPrice + "€",
                "lowPrice": photographsLowPrice + "€",
                "offerCount": this.photographers.length,
                "offers": []
            }
        }
    }

    /**
     * Home page : Create the clickable tags list in the header
     * @function
     * @memberof HomePage  
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
     * @function
     * @memberof HomePage  
     * @param {string} tag - The tag
     * @param {object} tagLink - The HTML tag link
     * @returns {object} - The HTML tags list
     */
    tagLoopFactorization(tag, tagLink) {
        const preservedThis = this;
        tagLink.addEventListener("click", function() {
            preservedThis.renderPhotographersCards(tag);
            preservedThis.localStorage.setStorage("tag", tag);
        }, true);
        tagLink.addEventListener("keyup", function(event) {
            if (event.key === 'Enter') {
                preservedThis.renderPhotographersCards(tag);
                preservedThis.localStorage.setStorage("tag", tag);
            }
        });
        const tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);
        return tagList;
    }


    /**
     * Home page : Add web semantics in the head of HTML in JSON-LD format
     * @function
     * @memberof HomePage  
     */
    renderSchemaJSONLD() {
        const schemaElement = document.createElement("script");
        schemaElement.type = "application/ld+json";
        schemaElement.innerHTML = JSON.stringify(this.data)
        document.getElementsByTagName('head')[0].appendChild(schemaElement);
    }

    /**
     * Render the photographers cards
     * @function
     * @memberof HomePage  
     * @param {string} tag - The tag to render
     */
    renderPhotographersCards(tag) {
        const offerJsonArray = [];
        if (tag === "") {
            this.photographers.forEach(photographer => {
                const card = document.createElement("article");
                card.setAttribute("aria-label", "Page de " + photographer.name);
                card.classList.add("photographer-card");
                const cardLink = document.createElement("a");
                cardLink.setAttribute("aria-label", "Page de " + photographer.name);
                cardLink.tabIndex = 0;
                cardLink.href = "./photographer.html";
                const preservedThis = this;
                cardLink.addEventListener("click", function() {
                    preservedThis.localStorage.setStorage("id", photographer.id);
                }, true);
                const mediaPath = "./public/img/photographers/" + photographer.id + ".jpg";
                const photoContainer = document.createElement("span");
                photoContainer.classList.add("photo-container");
                const photo = document.createElement("img");
                photo.src = mediaPath;
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
                // For the JSONLD
                offerJsonArray.push({
                    "@type": "Offer",
                    "name": photographer.name,
                    "description": "Photographer's day service",
                    "priceCurrency": "EUR",
                    "price": photographer.price + "€",
                    "url": cardLink.href,
                    "image": mediaPath,
                    "slogan": photographer.tagline,
                    "availableAtOrFrom": {
                        "@type": "Place",
                        "name": photographer.city + " in " + photographer.country
                    }
                });
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
        // Add the data to the JSON array & render it
        this.data.offers.offers = offerJsonArray;
        this.renderSchemaJSONLD();
    }
}