var temperature = 0;
var industrie = 0;
var transport = 0;
var agriculture = 0;
var chauffage = 0;
var carteJoués = [];
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
    };
    Carte.prototype.estJouable = function () {
        this.prerequis.forEach(function (pr) {
            // Prérequis non satisfait
            if (!(pr in carteJoués)) {
                return false;
            }
        });
        return true;
    };
    return Carte;
}());
