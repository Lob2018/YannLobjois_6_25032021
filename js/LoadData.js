/**
 * Load all the data from the JSON file
 */
export default class LoadData {
    loading(path) {
        // JSON photographers feed
        return fetch(path)
            .then(response => {
                // Return the JS object 
                return response.json();
            })
            .catch(() => {
                // If we have an error, explain it and propose a solution
                message.queue(-1, 12000, "Pas d'accès aux données des photographes.",
                    "Vérifier votre connexion au réseau, ou réessayer ultérieurement.");
                return -1;
            })
    }
}