let temperature = 0;
let industrie = 0;
let transport = 0;
let agriculture = 0;
let chauffage = 0;

let carteJoués = [];

type effet = {
    industrie: number;
    transport: number;
    agriculture: number;
    chauffage: number;
}

class Carte {
    id: number;
    nom: string;
    description: string;
    effets: effet;
    prerequis: number[];

    constructor(id: number, nom: string, description: string, effets: effet, prerequis: number[]) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
    }

    jouerCarte(){

        // Vérification si les prérequis sont satisfait.

        

    }

    estJouable(): boolean {

        this.prerequis.forEach(pr => {

            // Prérequis non satisfait
            if(!(pr in carteJoués)){
                return false;
            }

            
        });

        return true;
    }


}




