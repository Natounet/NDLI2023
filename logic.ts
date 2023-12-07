let temperature = 0;
let industrie = 0;
let transport = 0;
let agriculture = 0;
let chauffage = 0;

let carteJoues: number[] = [];
let allCartes: Carte[] = [];

function carteSuivante(): Carte {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait
    let carte: Carte;

    while(true){

        let random:number = Math.floor(Math.random() * allCartes.length);

        carte = allCartes[random];
        if(!(carte.id in carteJoues) && carte.estJouable()){
            return carte;
        }

    }
}

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
    source: string;

    constructor(id: number, nom: string, description: string, effets: effet, prerequis: number[], source: string) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
    }

    jouerCarte(){

        // Vérification si les prérequis sont satisfait.
        if(this.estJouable()){
            agriculture += this.effets.agriculture;
            industrie += this.effets.industrie;
            transport += this.effets.transport;
            chauffage += this.effets.chauffage;
            
            carteJoues.push(this.id);
        }
        

    }

    estJouable(): boolean {

        this.prerequis.forEach(pr => {

            // Prérequis non satisfait
            if(!(pr in carteJoues)){
                return false;
            }

            
        });

        return true;
    }
}




