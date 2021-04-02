// Toogle the navigation menu
function toogleNav() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
// Instantiate communication with the user
const message = new Message();
// Instantiate the data loader 
const loadData = new LoadData();
// Instantiate the factory 
const factory = new FishEyeFactory();
// Instantiate the photographs list
let photographers = [];
// Instantiate the media list
let medias = [];
// Instantiate the Set for tags
var theTags = new Set();

// Initialize to load the data, then factory it 
loadData.loading('./data/FishEyeDataFR.json').then(data => {
    return factoring(data);
}).then(code => {
    if (code == 0) {
        main();
    }
}).catch(err => {
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
    // Set all the tags, and add the photographer's medias objects
    for (let i = 0; i < photographers.length; i++) {
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
    photographers.forEach(element => {
        console.log(element)
    });
    console.log(theTags);
}