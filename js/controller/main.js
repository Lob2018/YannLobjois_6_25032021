// Import SASS for WebPack
import "../../scss/style.scss";
import Message from '../utils/Message.js';
import LoadData from '../entity/LoadData.js';
import FishEyeFactory from '../entity/FishEyeFactory.js';
import HomePage from "../view/HomePage";

// Instantiate communication with the user
const message = new Message();
// Instantiate the data loader 
const loadData = new LoadData();
// Instantiate the factory 
const factory = new FishEyeFactory();
// Instantiate the photographs list
const photographers = [];
// Instantiate the media list
const medias = [];
// Create the lowest price
let lowPrice;
// Create the highest price
let highPrice;
// Instantiate the Set for tags
const theTags = new Set();

// Initialize to load the data, then factory it 
loadData.loading('./data/FishEyeDataFR.json').then(data => {
    return factoring(data);
}).then(code => {
    if (code == 0) {
        main();
    }
}).catch(() => {
    // If we have an error, explain it and propose a solution
    message.queue(-1, 12000, "Les données chargées sont corrompues.",
        "Vérifier la cohérence, et le format des données stockées.");
    return -1;
})

// Factoring data content for photographers and their medias
function factoring(data) {
    // If no data then return
    if (data === -1) { return -1 }
    // create and list the media objects
    data.media.forEach(element => {
        medias.push(factory.createPhotography("media", element));
    });
    // create and list the photographer objects
    data.photographers.forEach(element => {
        photographers.push(factory.createPhotography("photographer", element));
    });
    // Instanciate the highest and lowest price
    lowPrice = highPrice = photographers[0].price;
    // Set all the tags, and add the photographer's medias objects
    for (let i = 0; i < photographers.length; i++) {
        if (photographers[i].price < lowPrice) lowPrice = photographers[i].price;
        if (photographers[i].price > highPrice) highPrice = photographers[i].price;
        for (let j = 0; j < medias.length; j++) {
            if (photographers[i].id === medias[j].photographerId) {
                photographers[i].addMedia(medias[j])
            }
        }
        // Add all the tags to their Set
        for (let k = 0; k < photographers[i].tags.length; k++) {
            theTags.add(photographers[i].tags[k])
        }
    }
    return 0;
}

// The main program
function main() {

    // Listener for the navigation link to content
    const mybutton = document.getElementsByClassName("btn-to-main")[0];
    let lastScrollTop = 0;
    document.addEventListener("scroll",
        function() {
            // pageYOffset for Apple/Safari and scrollTop for the others
            var st = window.pageYOffset || document.documentElement.scrollTop;
            if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                if (st > lastScrollTop) {
                    mybutton.style.display = "block";
                } else if (st < lastScrollTop) {
                    mybutton.style.display = "none";
                }
                lastScrollTop = st;
            } else mybutton.style.display = "none";
        }, false);

    // Get the current page type
    window.location.pathname.split("/").pop() === "photographer.html" ? photographersPage() : homePage();
}





/**
 * THE HOME PAGE
 */
function homePage() {
    // Instanciate the pages renderer with the values
    const homePage = new HomePage(theTags, photographers, highPrice, lowPrice);

    // RAZ of the tag's filters on logo's click
    const logo = document.getElementsByClassName("logo")[0];
    logo.addEventListener("click", function() {
        homePage.renderPhotographersCards("*");
    }, true);
    // Render the header JSON-LD web semantic
    homePage.renderSchemaJSONLD();
    // Render the clickable tags list in the header
    homePage.renderGlobalTags();
    // Render the photographers's cards
    homePage.renderPhotographersCards("");
}


/**
 * The photographers's page
 */
function photographersPage() {}