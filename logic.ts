let temperature = 0;
let industrie = 0;
let transport = 0;
let agriculture = 0;
let logement = 0;

let carteJoues: number[] = [];

// Main logic

type effet = {
    industrie: number;
    transport: number;
    agriculture: number;
    logement: number;
}

class Carte {
    id: number;
    nom: string;
    description: string;
    effets: effet;
    prerequis: number[];
    source: string;
    info: string;

    constructor(id: number, nom: string, description: string, effets: effet, prerequis: number[], source: string, info: string) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
        this.info = info;
    }




    jouerCarte() {

        // Vérification si les prérequis sont satisfait.
        if (this.estJouable()) {
            agriculture += this.effets.agriculture;
            industrie += this.effets.industrie;
            transport += this.effets.transport;
            logement += this.effets.logement;

            carteJoues.push(this.id);
        }


    }

    estJouable(): boolean {

        this.prerequis.forEach(pr => {

            // Prérequis non satisfait
            if (!(pr in carteJoues)) {
                return false;
            }


        });

        return true;
    }
}
let allCartes: Carte[] = [];



async function creerCarte(): Promise<Carte[]> {
    let allCartes: Carte[] = [];

    const response = await fetch("http://127.0.0.1:8000/cartes.json");

    let data = await response.json();
    let cartes = Object.values(data);

    cartes.forEach((obj: any) => allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info)));

    return allCartes;

}



function partieTermine(): boolean {
    if (temperature <= 10 && temperature <= -10) {
        if (industrie < 100 && transport < 100 && agriculture < 100 && logement < 100) {
            if (carteJoues.length != allCartes.length) {
                return false;
            }
        }
    }
    return true;
}




function carteSuivante(): Carte {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait
    let carte: Carte;

    while (true) {

        let random: number = Math.floor(Math.random() * allCartes.length);

        carte = allCartes[random];
        if (!(carte.id in carteJoues) && carte.estJouable()) {
            return carte;
        }

    }
}

function genererAffichageCarte(carte: Carte): string {
    return `<div class="carte"><h3 class="carte">${carte.nom}</h3><div class="carte_interieur"><p class ="carte">${carte.description}</p></div></div>`;
}

async function main() {
    let allCartes: Carte[] = await creerCarte();
    const carteElement = document.createElement('div');
    carteElement.innerHTML = genererAffichageCarte(allCartes[0]);
    document.body.appendChild(carteElement);
}

main();





