var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var allCartes = [];
function creerCarte() {
    return __awaiter(this, void 0, void 0, function () {
        var allCartes, response, data, cartes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allCartes = [];
                    return [4 /*yield*/, fetch("/cartes.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    cartes = Object.values(data);
                    cartes.forEach(function (obj) { return allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info)); });
                    return [2 /*return*/, allCartes];
            }
        });
    });
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
function genererAffichageCarte(carte) {
    return "<div class=\"carte\"><h3 class=\"carte\">".concat(carte.nom, "</h3><div class=\"carte_interieur\"><p class =\"carte\">").concat(carte.description, "</p></div></div>");
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
main();
