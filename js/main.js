// Import SASS for WebPack
import "../scss/style.scss";
import Message from './Message.js';
import LoadData from './LoadData.js';
import FishEyeFactory from './FishEyeFactory.js';
import PageRenderer from "./PageRenderer";

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
// Prepare the pages renderer
let pageRenderer;

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
    let mybutton = document.getElementsByClassName("btn-to-main")[0];
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

    // Instanciate the pages renderer with the values
    pageRenderer = new PageRenderer(theTags, photographers, highPrice, lowPrice);


    // Is it the Home page ?
    let home = window.location.pathname.split("/").pop() === "index.html";

    /* ONLY FORCE WITH WEBPACK SERVER */
    home = true;

    // Get the current page type
    home ? homePage() : photographersPage();
}





/**
 * THE HOME PAGE
 */
function homePage() {

    // Load the header JSON-LD web semantic
    pageRenderer.homeSchemaJSON();

    // Create the clickable tags list in the header
    pageRenderer.homeTheTags();

    // Create the photographers's cards
    pageRenderer.homePhotographersCards();

}


/**
 * The photographers's page
 */
function photographersPage() {}