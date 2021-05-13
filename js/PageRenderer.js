/**
 * The pages renderer object
 */
export default class PageRenderer {

    constructor(theTags, photographers, photographsHighPrice, photographsLowPrice) {
        this.theTags = theTags;
        this.photographers = photographers;
        this.indexPhotographersTagLinks = document.getElementsByClassName("index-categories")[0];
        this.indexCardsElementContainer = document.getElementsByClassName("cards-photographs")[0];
        this.photographsHighPrice = photographsHighPrice;
        this.photographsLowPrice = photographsLowPrice;
    }


    // Show the tagged photographers
    renderTheTaggedPhotographers() {
        this.photographersFromTag.forEach(photographer => {
            console.log(photographer.name)
        })
    }

    // Set the photographers by tag selection
    setTheTaggedPhotographers(tag) {
        // Clear the current tagged photographers list
        this.photographersFromTag = [];
        this.photographers.forEach(photographer => {
            if (photographer.tags.includes(tag)) this.photographersFromTag.push(photographer);
        });
        this.renderTheTaggedPhotographers();
    }

    // Home page : Create the clickable tags list in the header
    homeTheTags() {
        this.theTags.forEach(tag => {
            let tagLink = document.createElement("A");
            tagLink.setAttribute("role", "menuitem");
            tagLink.tabIndex = 0;
            tagLink.textContent = "#" + tag.charAt(0).toUpperCase() + tag.slice(1);
            this.indexPhotographersTagLinks.appendChild(this.tagLoopFactorization(tag, tagLink));
        });
    }

    // Tag loop factorization (listener, add li, return list)
    tagLoopFactorization(tag, tagLink) {
        let preservedThis = this;
        tagLink.addEventListener("click", function() {
            preservedThis.setTheTaggedPhotographers(tag);
        }, true);
        let tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);
        return tagList;
    }

    // Home page : Add web semantics in the head of HTML in JSON-LD format
    homeSchemaJSON() {
        let schemaElement = document.getElementById("dynamicJSONLD");
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

        this.photographers.forEach(photographer => {
            let card = document.createElement("article");
            card.setAttribute("role", "contentinfo");
            card.setAttribute("aria-label", "article");
            card.classList.add("photographer-card");
            let cardLink = document.createElement("a");
            cardLink.setAttribute("role", "navigation");
            cardLink.tabIndex = 0;
            cardLink.href = "./html/photographer.html";
            let preservedThis = this;
            cardLink.addEventListener("click", function() {
                preservedThis.writeStorage("id", photographer.id);
            }, true);
            // TEST
            let photoJGP = "./img/photographers/" + photographer.id + ".jpg";
            // PROD
            // let photoJGP= window.location.pathname + "/img/photographers/" + + photographer.id + ".jpg";

            let photoContainer = document.createElement("picture");
            photoContainer.style.backgroundImage = "url('" + photoJGP + "')";

            let photo = document.createElement("img");
            photo.src = photoJGP;

            photo.setAttribute("alt", photographer.name);
            photoContainer.appendChild(photo);
            cardLink.appendChild(photoContainer);
            let titre = document.createElement("h2");
            titre.textContent = photographer.name;
            cardLink.appendChild(titre);
            card.appendChild(cardLink);
            let texte = document.createElement("P");
            let texte1 = document.createElement("span");
            let texte1CR = document.createElement("br");
            let texte2 = document.createElement("span");
            let texte2CR = document.createElement("br");
            let texte3 = document.createElement("span");
            texte1.textContent = photographer.city + ", " + photographer.country;
            texte2.textContent = photographer.tagline;
            texte3.textContent = photographer.price + "€/jour";
            texte.appendChild(texte1);
            texte.appendChild(texte1CR);
            texte.appendChild(texte2);
            texte.appendChild(texte2CR);
            texte.appendChild(texte3);
            card.appendChild(texte);


            let tags = document.createElement("ul");
            tags.classList.add("index-categories");
            tags.classList.add("index-photographer-categories");
            tags.setAttribute("role", "menubar");
            tags.setAttribute("aria-label", "photographer categories");


            photographer.tags.forEach(tag => {
                let tagLink = document.createElement("A");
                tagLink.setAttribute("role", "menuitem");
                tagLink.tabIndex = 0;
                tagLink.textContent = "#" + tag;
                tags.appendChild(this.tagLoopFactorization(tag, tagLink));
            });
            card.appendChild(tags);

            this.indexCardsElementContainer.appendChild(card);

        });

    }

    // Photographers page : Add web semantics in the head of HTML in JSON-LD format
    photographersSchemaJSON() {
        // Get the Photograph with the stored id value
        if (this.photograph === undefined) this.photograph = this.photographers.filter(p => p.id === parseInt(this.readStorage("id"), 10))[0];
        // Get the lowest and the highest achievements's prices
        let photographerMedias = this.photograph.medias;
        let photosHighestPrice = this.getArraysExtremes(photographerMedias, "price", "max");
        let photoLowestPrice = this.getArraysExtremes(photographerMedias, "price", "min");
        // Add web semantic
        let schemaElement = document.getElementById("dynamicJSONLD");
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