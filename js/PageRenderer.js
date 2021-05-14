/**
 * The pages renderer object
 */
export default class PageRenderer {

    constructor(theTags, photographers, photographsHighPrice, photographsLowPrice) {
        this.theTags = theTags;
        this.photographers = photographers;
        this.indexPhotographersTagLinks = document.getElementsByClassName("index-categories")[0];
        this.indexCardsElementContainer = document.getElementsByClassName("cards-photographs")[0];
        this.indexCardsElementArray = [];
        this.photographsHighPrice = photographsHighPrice;
        this.photographsLowPrice = photographsLowPrice;
    }


    // Set the photographers by tag selection
    setTheTaggedPhotographers(tag) {
        // Clear the current tagged photographers list
        this.photographersFromTag = [];
        this.photographers.forEach(photographer => {
            if (photographer.tags.includes(tag)) this.photographersFromTag.push(photographer);
        });
        this.renderPhotographersCards(this.photographersFromTag);
    }

    // Home page : Create the clickable tags list in the header
    homeTheTags() {
        this.theTags.forEach(tag => {
            const tagLink = document.createElement("A");
            tagLink.setAttribute("role", "menuitem");
            tagLink.tabIndex = 0;
            tagLink.textContent = "#" + tag.charAt(0).toUpperCase() + tag.slice(1);
            this.indexPhotographersTagLinks.appendChild(this.tagLoopFactorization(tag, tagLink));
        });
    }

    // Tag loop factorization (listener, add li, return list)
    tagLoopFactorization(tag, tagLink) {
        const preservedThis = this;
        tagLink.addEventListener("click", function() {
            preservedThis.setTheTaggedPhotographers(tag);
        }, true);
        const tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);
        return tagList;
    }

    // Home page : Add web semantics in the head of HTML in JSON-LD format
    homeSchemaJSON() {
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

    // Home page : the photographers's cards
    homePhotographersCards() {
        this.renderPhotographersCards(this.photographers);
    }

    // Photographers page : Add web semantics in the head of HTML in JSON-LD format
    photographersSchemaJSON() {
        // Get the Photograph with the stored id value
        if (this.photograph === undefined) this.photograph = this.photographers.filter(p => p.id === parseInt(this.readStorage("id"), 10))[0];
        // Get the lowest and the highest achievements's prices
        const photographerMedias = this.photograph.medias;
        const photosHighestPrice = this.getArraysExtremes(photographerMedias, "price", "max");
        const photoLowestPrice = this.getArraysExtremes(photographerMedias, "price", "min");
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

    // Render the phtographers cards from an array
    renderPhotographersCards(photographers) {
        this.indexCardsElementArray = [];
        photographers.forEach(photographer => {
            const card = document.createElement("article");
            card.setAttribute("role", "contentinfo");
            card.setAttribute("aria-label", "article");
            card.classList.add("photographer-card");
            const cardLink = document.createElement("a");
            cardLink.setAttribute("role", "navigation");
            cardLink.tabIndex = 0;
            cardLink.href = "./html/photographer.html";
            const preservedThis = this;
            cardLink.addEventListener("click", function() {
                preservedThis.writeStorage("id", photographer.id);
            }, true);
            const photoJGP = "./img/photographers/" + photographer.id + ".jpg";
            const photoContainer = document.createElement("picture");
            photoContainer.style.backgroundImage = "url('" + photoJGP + "')";
            const photo = document.createElement("img");
            photo.src = photoJGP;
            photo.setAttribute("alt", photographer.name);
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
            this.indexCardsElementArray.push(card);
        });
        this.indexCardsElementContainer.replaceChildren(...this.indexCardsElementArray);
    }


    // Like is pressed
    likedToggle() {

    }

    // Read on local storage
    readStorage(item) {
        return localStorage.getItem(item);
    }

    // Write on local storage
    writeStorage(item, value) {
        localStorage.setItem(item, value);
    }

    // Get the max or min from an array with an accumulator of callback's return value
    getArraysExtremes(array, value, type) {
        if (type === "min") {
            return array.reduce(
                (max, element) => (element[value] > max ? element[value] : max),
                array[0][value]);
        } else {
            return array.reduce(
                (min, element) => (element[value] < min ? element[value] : min),
                array[0][value]);
        }
    }



}