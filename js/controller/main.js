// Import SASS for WebPack
import "../../scss/style.scss";
import Message from '../utils/Message.js';
import LoadData from '../entity/LoadData.js';
import FishEyeFactory from '../entity/FishEyeFactory.js';
import HomePage from "../view/HomePage.js";
import PhotographersPage from "../view/PhotographersPage.js";
import LocalStorage from "../utils/LocalStorage.js";
import getArraysJsonElement from "../utils/getArraysJsonElement";

// Instantiate communication with the user
const message = new Message();
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
// Instanciate the local storage
const localStorage = new LocalStorage();


/**
 * Initialize to load the data, factory and store it in loadData, then redirect to the corresponding page
 */
const loadData = new LoadData('./data/FishEyeDataFR.json').then(data => {
    return factoring(data);
}).then(code => {
    if (code == 0) {
        // Redirect to the the corresponding page
        window.location.pathname.split("/").pop() === "photographer.html" ? photographersPage() : homePage();
    }
}).catch(() => {
    // If we have an error, explain it and propose a solution
    message.queue(-1, 12000, "Les données chargées sont corrompues.",
        "Vérifier la cohérence, et le format des données stockées.");
    return -1;
})

/**
 * Factoring data content for photographers and their medias
 * @param {object} data - The data to factor
 * @returns {number} - The result number (0 if it's ok)
 */
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


/**
 * Manage the home page
 */
function homePage() {
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
    // Instanciate the pages renderer with the values
    const homePage = new HomePage(theTags, photographers, highPrice, lowPrice);
    // RAZ of the tag's filters on logo's click
    const logo = document.getElementsByClassName("logo--home")[0];
    logo.addEventListener("click", function() {
        homePage.renderPhotographersCards("*");
        localStorage.clear();
    }, true);
    // Render the header JSON-LD web semantic
    homePage.renderSchemaJSONLD();
    // Render the clickable tags list in the header
    homePage.renderGlobalTags();
    // Is there a local storage tag selected
    const tag = localStorage.getStorage("tag");
    if (tag === null) {
        // Render all the photographers's cards
        homePage.renderPhotographersCards("");
    } else {
        // Load and render the photographer's card with this tag
        homePage.renderPhotographersCards("");
        homePage.renderPhotographersCards(tag);
    }
}


/**
 * Manage the photographers's page
 */
function photographersPage() {
    // RAZ of the tag's filters on logo's click
    const logo = document.getElementsByClassName("logo--photographer")[0];
    logo.addEventListener("click", function() {
        localStorage.clear();
    }, true);
    // Redirect to home page, if there is no photographer's id in the local storage
    const id = localStorage.getStorage("id");
    if (id === null) window.location.href = "./index.html";
    // Instanciate the pages renderer with the values
    const photographerPage = new PhotographersPage(getArraysJsonElement(photographers, "id", id)[0]);
    // Render the header JSON-LD web semantic
    photographerPage.renderSchemaJSONLD();
    // Render the clickable tags list in the header
    photographerPage.renderPhotographerTags();
    // Show the modal on the contact button's click
    const btnContact = document.getElementsByClassName("btn__contact")[0];
    btnContact.addEventListener("click", function() {
        alert('oo')
    }, true);
    // Render the header information
    photographerPage.renderHeaderInformation();
}