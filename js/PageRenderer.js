/**
 * The pages renderer object
 */
export default class PageRenderer {

    constructor(theTags, photographers) {
        this.theTags = theTags;
        this.photographers = photographers;
        this.photographersTagLinks = document.getElementsByClassName("index-categories")[0];
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

    // Create the clickable tags list in the header
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



}