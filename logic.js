var temperature = 0;
var industrie = 0;
var transport = 0;
var agriculture = 0;
var chauffage = 0;
var carteJoues = [];
var allCartes = [];
// Main logic
while (!partieTermine()) {
}
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
    function Carte(id, nom, description, effets, prerequis, source) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
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
