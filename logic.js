"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var temperature = 0;
var industrie = 0;
var transport = 0;
var agriculture = 0;
var chauffage = 0;
var carteJoues = [];
var allCartes = [];
var Carte = /** @class */ (function () {
    function Carte(id, nom, description, effets, prerequis) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
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
