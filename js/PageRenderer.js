/**
 * The pages renderer object
 */
export default class PageRenderer {

    constructor(theTags, photographers, photographsHighPrice, photographsLowPrice) {
        this.theTags = theTags;
        this.photographers = photographers;
        this.photographersTagLinks = document.getElementsByClassName("index-categories")[0];
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
            let preservedThis = this;
            tagLink.addEventListener("click", function() {
                preservedThis.setTheTaggedPhotographers(tag);
            }, true);
            let tagList = document.createElement("LI");
            tagList.setAttribute("role", "none");
            tagList.appendChild(tagLink);
            this.photographersTagLinks.appendChild(tagList);
        });
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

    // Photographers page : Add web semantics in the head of HTML in JSON-LD format
    photographersSchemaJSON() {
        // Get the Photograph with the stored id value
        if (this.photograph === undefined) this.photograph = this.photographers.filter(p => p.id === parseInt(this.readStorage("id"), 10))[0];
        // Get the lowest and the highest achievements's prices
        let photographerMedias = this.photograph.medias;
        let photosHighestPrice = this.getArraysExtremes(photographerMedias, "price", "highest");
        let photoLowestPrice = this.getArraysExtremes(photographerMedias, "price", "lowest");
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

    // Get the highest or lowest from an array with an accumulator which will accumulate the callback's return value
    getArraysExtremes(array, value, type) {
        if (type === "lowest") {
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