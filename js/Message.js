/**
 * Give a message to the user
 * type 0 for normal message and -1 for error
 * Singleton design pattern
 */
export default class Message {
    static instance;
    constructor() {
        if (Message.instance) {
            return Message.instance;
        }
        Message.instance = this;
        this.messagesArray = [];
    }

    // Add the message to the waiting list
    queue(type, duration, message, resolution) {
        // Check the arguments values
        if (this.checked(type, duration)) {
            this.messagesArray.push({ message: message, duration: duration, resolution: resolution, type: type });
            if (this.messagesArray.length === 1) this.rendered();
        }
    }

    // Check the arguments
    checked(type, duration) {
        return ((type === 0 || type === -1) && (duration > 200))
    }

    // Render the first message, then the others by recursion 
    rendered() {
        const preservedThis = this;
        preservedThis.bloc = preservedThis.createTheHtmlElement(preservedThis.messagesArray[0].type, preservedThis.messagesArray[0].message, preservedThis.messagesArray[0].resolution);
        document.body.insertBefore(preservedThis.bloc, document.body.firstChild);
        if (preservedThis.messagesArray[0].type === -1) {
            document.getElementsByClassName('user-message-primary')[0].style.animationDuration = preservedThis.messagesArray[0].duration / 1000 + "s";
        } else {
            document.getElementsByClassName('user-message-secondary')[0].style.animationDuration = preservedThis.messagesArray[0].duration / 1000 + "s";
        }

        // Delay the next rendering
        preservedThis.myTimer = setTimeout(function() {
            preservedThis.stopRenderer(preservedThis);
        }, preservedThis.messagesArray[0].duration);

        // Stop the rendering when the message is closed
        const closeButton = preservedThis.bloc.getElementsByClassName('user-message__close')[0];
        closeButton.onclick = function() { preservedThis.closeMessage(preservedThis) };

    }

    stopRenderer(preservedThis) {
        preservedThis.messagesArray.shift();
        preservedThis.bloc.remove();
        if (preservedThis.messagesArray.length > 0) preservedThis.rendered();
    }

    closeMessage(preservedThis) {
        preservedThis.stopRenderer(preservedThis);
        clearTimeout(preservedThis.myTimer);
    }

    // Create the HTML bloc
    createTheHtmlElement(type, message, resolution) {
        const bloc = document.createElement('div');
        const element = document.createElement('p');
        const elementMessage = document.createElement('span');
        const elementResolution = document.createElement('span');
        const elementBr = document.createElement('br');
        const elementClose = document.createElement('span');
        element.setAttribute("role", "alertdialog");
        elementMessage.textContent = message;
        element.appendChild(elementMessage);
        elementClose.setAttribute("class", "user-message__close");
        elementClose.setAttribute("aria-label", "Fermer ce message");
        elementClose.setAttribute("title", "Fermer ce message");
        elementClose.setAttribute("tabindex", "0");
        element.appendChild(elementClose);
        if (type == -1) {
            element.setAttribute("aria-labelledby", "user-message-primary");
            bloc.setAttribute("class", "user-message-primary");
            element.setAttribute("class", "text--error");
            elementResolution.textContent = " Vous pouvez : " + resolution;
            element.appendChild(elementBr);
            element.appendChild(elementResolution);
        } else {
            element.setAttribute("aria-labelledby", "user-message-secondary");
            bloc.setAttribute("class", "user-message-secondary");
            element.setAttribute("class", "text--info");
        }
        bloc.appendChild(element);
        return bloc;
    }


}