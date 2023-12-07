import * as fs from 'fs';
let temperature = 0;
let industrie = 0;
let transport = 0;
let agriculture = 0;
let chauffage = 0;

let carteJoues: number[] = [];
let allCartes: Carte[] = [];

// Main logic

creerCarte();

function creerCarte(){
    fs.readFile('cartes.json','utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
    
        // Parse the JSON string into an array of objects
        let objArray = JSON.parse(data);
        let cartes = Object.values(objArray);
        // Map each object to a new Carte instance and push them to allCartes
        cartes.forEach((obj:any) => allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info)));
    
        // Now allCartes array is filled with 'Carte' objects
        console.log(allCartes);
    }

)}

console.log(allCartes)


function partieTermine(): boolean {
    if (temperature <= 10 && temperature <= -10) {
        if (industrie < 100 && transport < 100 && agriculture < 100 && chauffage < 100) {
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
    info: string;

    constructor(id: number, nom: string, description: string, effets: effet, prerequis: number[], source: string, info:string) {
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
            chauffage += this.effets.chauffage;

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




