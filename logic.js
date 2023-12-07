"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var temperature = 0;
var industrie = 0;
var transport = 0;
var agriculture = 0;
var logement = 0;
var carteJoues = [];
var Carte = /** @class */ (function () {
    function Carte(id, nom, description, effets, prerequis, source, info) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
        this.info = info;
    }
    Carte.prototype.jouerCarte = function () {
        // Vérification si les prérequis sont satisfait.
        if (this.estJouable()) {
            agriculture += this.effets.agriculture;
            industrie += this.effets.industrie;
            transport += this.effets.transport;
            logement += this.effets.logement;
            carteJoues.push(this.id);
        }
    };
    Carte.prototype.estJouable = function () {
        this.prerequis.forEach(function (pr) {
            // Prérequis non satisfait
            if (!(pr in carteJoues)) {
                return false;
            }
        });
        return true;
    };
    return Carte;
}());
var allCartes = creerCarte();
function creerCarte() {
    var allCartes = [];
    var data = fs.readFileSync('cartes.json', 'utf-8');
    var objArray = JSON.parse(data);
    var cartes = Object.values(objArray);
    cartes.forEach(function (obj) { return allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info)); });
    return allCartes;
}
function partieTermine() {
    if (temperature <= 10 && temperature <= -10) {
        if (industrie < 100 && transport < 100 && agriculture < 100 && logement < 100) {
            if (carteJoues.length != allCartes.length) {
                return false;
            }
        }
    }
    return true;
}
function carteSuivante() {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait
    var carte;
    while (true) {
        var random = Math.floor(Math.random() * allCartes.length);
        carte = allCartes[random];
        if (!(carte.id in carteJoues) && carte.estJouable()) {
            return carte;
        }
    }
}
function main() {
}
main();
