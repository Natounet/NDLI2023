"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var temperature = 0;
var industrie = 0;
var transport = 0;
var agriculture = 0;
var chauffage = 0;
var carteJoues = [];
var allCartes = [];
// Main logic
creerCarte();
function creerCarte() {
    fs.readFile('cartes.json', 'utf-8', function (err, data) {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        // Parse the JSON string into an array of objects
        var objArray = JSON.parse(data);
        var cartes = Object.values(objArray);
        // Map each object to a new Carte instance and push them to allCartes
        cartes.forEach(function (obj) { return allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info)); });
        // Now allCartes array is filled with 'Carte' objects
        console.log(allCartes);
    });
}
console.log(allCartes);
function partieTermine() {
    if (temperature <= 10 && temperature <= -10) {
        if (industrie < 100 && transport < 100 && agriculture < 100 && chauffage < 100) {
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
            chauffage += this.effets.chauffage;
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
