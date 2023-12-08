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
var industrie = 50;
var transport = 50;
var agriculture = 50;
var logement = 50;
var carteJoues = [];
var carteActuelle;
var boutonVertRestant = 10;
var type;
(function (type) {
    type[type["info"] = 0] = "info";
    type[type["action"] = 1] = "action";
})(type || (type = {}));
var Carte = /** @class */ (function () {
    function Carte(id, nom, description, effets, prerequis, source, info, type) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
        this.info = info;
        this.type = type;
    }
    Carte.prototype.boutonVert = function () {
        if (this.type == type.info)
            return;
        if (boutonVertRestant > 0) {
            // Vérification si les prérequis sont satisfait.
            if (this.estJouable()) {
                agriculture += this.effets.agriculture;
                industrie += this.effets.industrie;
                transport += this.effets.transport;
                logement += this.effets.logement;
                carteJoues.push(this.id);
            }
            var svgContainerLogement = document.querySelector('.svg-container.logement');
            if (svgContainerLogement) {
                var firstSvg = svgContainerLogement.querySelector('.first');
                if (firstSvg)
                    firstSvg.style.clipPath = "polygon(0 " + (100 - logement) + "%, 100% " + (100 - logement) + "%, 100% 100%, 0 100%)";
            }
            var svgContainerTransport = document.querySelector('.svg-container.transport');
            if (svgContainerTransport) {
                var firstSvg = svgContainerTransport.querySelector('.first');
                if (firstSvg)
                    firstSvg.style.clipPath = "polygon(0 " + (100 - transport) + "%, 100% " + (100 - transport) + "%, 100% 100%, 0 100%)";
            }
            var svgContainerIndustrie = document.querySelector('.svg-container.industrie');
            if (svgContainerIndustrie) {
                var firstSvg = svgContainerIndustrie.querySelector('.first');
                if (firstSvg)
                    firstSvg.style.clipPath = "polygon(0 " + (100 - industrie) + "%, 100% " + (100 - industrie) + "%, 100% 100%, 0 100%)";
            }
            var svgContainerAgriculture = document.querySelector('.svg-container.agriculture');
            if (svgContainerAgriculture) {
                var firstSvg = svgContainerAgriculture.querySelector('.first');
                if (firstSvg)
                    firstSvg.style.clipPath = "polygon(0 " + (100 - agriculture) + "%, 100% " + (100 - agriculture) + "%, 100% 100%, 0 100%)";
            }
            boutonVertRestant -= 1;
        }
    };
    Carte.prototype.boutonRouge = function () {
        if (this.type == type.info)
            return;
        // Vérification si les prérequis sont satisfait.
        if (this.estJouable()) {
            agriculture -= this.effets.agriculture;
            industrie -= this.effets.industrie;
            transport -= this.effets.transport;
            logement -= this.effets.logement;
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
                    return [4 /*yield*/, fetch("cartes.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    cartes = Object.values(data);
                    cartes.forEach(function (obj) {
                        return allCartes.push(new Carte(obj.id, obj.nom, obj.description, obj.effets, obj.prerequis, obj.source, obj.info, obj.type));
                    });
                    return [2 /*return*/, allCartes];
            }
        });
    });
}
function partieTermine() {
    return ((industrie > 100 ||
        transport > 100 ||
        agriculture > 100 ||
        logement > 100) || carteJoues.length == allCartes.length || boutonVertRestant == 0);
}
function carteSuivante() {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait
    for (var i = 0; i < allCartes.length; i++) {
        if (!carteJoues.includes(i) && allCartes[i].estJouable()) {
            return allCartes[i];
        }
    }
    console.log("Je n'ai pas trouvé de carte candidate..");
    return null;
}
function genererAffichageCarte(carte) {
    return "<div class=\"carte\"><h2>".concat(carte.nom, "</h2><div class=\"carte_interieur\"><p>").concat(carte.description, "</p></div></div>");
}
var div;
var startX = 0;
var isClicked = false;
var index = 0;
function boucle() {
    if (partieTermine()) {
        var carteActuelle_1 = null;
    }
    ;
    if (index == 0) {
        carteActuelle = allCartes[0];
    }
    carteActuelle = carteSuivante();
    if (carteActuelle == null) {
        console.log("Il n'y a plus de cartes candidates.");
        return;
    }
    // Création de la carte dans le DOM
    var cartehtml = genererAffichageCarte(carteActuelle);
    div = document.createElement("div");
    div.innerHTML = cartehtml;
    // The card come from under the screen
    // Ajout de la carte dans le DOM
    document.body.appendChild(div);
    var a = document.body.getElementsByClassName("carte")[0];
    a.style.transform = "translateY(100%) translateX(-50%)";
    // Force a reflow to make sure the initial state is applied
    void a.offsetWidth;
    a.style.transition = "transform 0.6s ease-in-out";
    a.style.transform = "translateY(0%) translateX(-50%)";
    // Ajout de l'event listener pour le drag
    div.addEventListener("mousedown", function (event) {
        isClicked = true;
        // Listen for mousemove events on the document
        startX = event.clientX;
    });
    index++;
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function actionCarte(event) {
    return __awaiter(this, void 0, void 0, function () {
<<<<<<< HEAD
        var endX, direction, card, card;
=======
        var carteActuelle_2, endX, direction, card, card, rickrollDiv;
>>>>>>> 3f259bd8a1c8e052f7dd681e1ddafbec4fe35ceb
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (partieTermine()) {
                        carteActuelle_2 = null;
                    }
                    ;
                    endX = event.clientX;
                    if (isClicked == false)
                        return [2 /*return*/];
                    isClicked = false;
                    direction = endX > startX ? "right" : "left";
                    if (direction == "right") {
                        if (carteActuelle == null) {
                            console.log("Game over, no new cards will be generated.");
                            return [2 /*return*/];
                        }
                        else {
                            carteActuelle.boutonVert();
                        }
                        card = div.getElementsByTagName("div")[0];
                        card.style.transition =
                            "transform 1s ease-out, opacity 1s ease-out";
                        card.style.transform = "translateX(400%)";
                        card.style.opacity = "0";
                        // remove the card from the DOM after the animation is finished
                    }
                    else {
                        if (carteActuelle == null) {
                            console.log("Game over, no new cards will be generated.");
                            return [2 /*return*/];
                        }
                        else {
                            carteActuelle.boutonRouge();
                        } // add translation to go outside of the screen
                        card = div.getElementsByTagName("div")[0];
                        card.style.transition =
                            "transform 1s ease-out, opacity 1s ease-out";
                        card.style.transform = "translateX(-400%)";
                        card.style.opacity = "0";
                        // remove the card from the DOM after the animation is finished
                    }
                    return [4 /*yield*/, delay(1000)];
                case 1:
                    _a.sent();
                    div.remove();
                    if (!partieTermine()) {
                        boucle();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function rickrollFunc() {
    var rickrollDiv = document.createElement("div");
    rickrollDiv.innerHTML = "<img src=\"../assets/rickroll.gif\">";
    rickrollDiv.style.position = "fixed";
    rickrollDiv.style.left = "50%";
    rickrollDiv.style.transform = "translateX(-50%)";
    rickrollDiv.style.zIndex = '999';
    var audio = document.createElement("audio");
    audio.classList.add("audio-tag");
    audio.src = '../assets/rickroll.mp3';
    audio.autoplay = true; // Add the autoplay attribute to play the audio automatically
    document.body.appendChild(audio);
    document.body.appendChild(rickrollDiv);
}
function rotateCard(event) {
    if (partieTermine()) {
        var carteActuelle_3 = null;
    }
    ;
    if (!isClicked || div == null)
        return;
    // Calculate the rotation angle based on the mouse position
    var rotationAngle = ((event.clientX - window.innerWidth / 2) /
        (window.innerWidth / 2)) *
        30; // Adjust the divisor to change the rotation speed
    var tkt = div.getElementsByTagName("div")[0];
    tkt.style.transition = "none";
    tkt.style.transform = "translateX(-50%) rotate(".concat(rotationAngle, "deg)");
}
function greenButton(event) {
    return __awaiter(this, void 0, void 0, function () {
        var carteActuelle_4, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (partieTermine()) {
                        carteActuelle_4 = null;
                    }
                    ;
                    if (carteActuelle == null) {
                        console.log("Game over, no new cards will be generated.");
                        return [2 /*return*/];
                    }
                    else {
                        carteActuelle.boutonVert();
                    }
                    card = div.getElementsByTagName("div")[0];
                    card.style.transition =
                        "transform 1s ease-out, opacity 1s ease-out";
                    card.style.transform = "translateX(400%)";
                    card.style.opacity = "0";
                    return [4 /*yield*/, delay(1000)];
                case 1:
                    _a.sent();
                    div.remove();
                    if (!partieTermine()) {
                        boucle();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function redButton(event) {
    return __awaiter(this, void 0, void 0, function () {
        var carteActuelle_5, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (partieTermine()) {
                        carteActuelle_5 = null;
                    }
                    ;
                    if (carteActuelle == null) {
                        console.log("Game over, no new cards will be generated.");
                        return [2 /*return*/];
                    }
                    else {
                        carteActuelle.boutonRouge();
                    } // add translation to go outside of the screen
                    card = div.getElementsByTagName("div")[0];
                    card.style.transition =
                        "transform 1s ease-out, opacity 1s ease-out";
                    card.style.transform = "translateX(-400%)";
                    card.style.opacity = "0";
                    return [4 /*yield*/, delay(1000)];
                case 1:
                    _a.sent();
                    div.remove();
                    if (!partieTermine()) {
                        boucle();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function keyboardHandler(event) {
    return __awaiter(this, void 0, void 0, function () {
        var carteActuelle_6;
        return __generator(this, function (_a) {
            if (partieTermine()) {
                carteActuelle_6 = null;
            }
            ;
            // Arrow and D and Q
            if (event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "d" || event.key == "q") {
                if (event.key == "ArrowLeft" || event.key == "q") {
                    redButton(event);
                }
                else {
                    greenButton(event);
                }
            }
            return [2 /*return*/];
        });
    });
}
function main() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, creerCarte()];
                case 1:
                    allCartes = _d.sent();
                    // Cards listeners
                    document.addEventListener("mousemove", rotateCard);
                    document.addEventListener("mouseup", actionCarte);
                    root = document.querySelector(':root');
                    document.getElementById("theme-button").addEventListener("click", function () {
                        var val = document.getElementById("theme-selector").style.display;
                        document.getElementById("theme-selector").style.display = val == "none" ? "block" : "none";
                    });
                    // Theme buttons listeners
                    (_a = document.getElementById("classic-theme-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                        root.style.setProperty('--primary-color', '#1A4536');
                        root.style.setProperty('--acce>nt-green', '#3fe97d');
                        root.style.setProperty('--accent-saumon', '#FF9999');
                        root.style.setProperty('--secondary-color', '#1B7958');
                        document.body.style.background = "var(--primary-color)";
                        document.body.style.animation = "none";
                        var audioElement = document.querySelector(".audio-tag");
                        if (audioElement) {
                            document.body.removeChild(audioElement);
                        }
                        document.getElementById("theme-selector").style.display = "none";
                    });
                    (_b = document.getElementById("contrast-theme-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
                        root.style.setProperty('--primary-color', '#0E271E');
                        root.style.setProperty('--accent-green', '#DCEA3B');
                        root.style.setProperty('--accent-saumon', '#0E271E');
                        root.style.setProperty('--secondary-color', '#0E271E');
                        document.body.style.background = "var(--primary-color)";
                        document.body.style.animation = "none";
                        var audioElement = document.querySelector(".audio-tag");
                        if (audioElement) {
                            document.body.removeChild(audioElement);
                        }
                        document.getElementById("theme-selector").style.display = "none";
                    });
                    (_c = document.getElementById("disco-theme-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
                        root.style.setProperty('--primary-color', '#ffbf66');
                        root.style.setProperty('--accent-green', '');
                        root.style.setProperty('--accent-saumon', '#00353f');
                        root.style.setProperty('--secondary-color', '#08c5d1');
                        document.body.style.backgroundSize = "1000%";
                        document.body.style.backgroundPosition = "left";
                        document.body.style.animation = "10s discoBg ease infinite";
                        var audio = document.createElement("audio");
                        audio.classList.add("audio-tag");
                        audio.src = '../assets/discoMusic.mp3';
                        audio.autoplay = true; // Add the autoplay attribute to play the audio automatically
                        document.body.appendChild(audio);
                        document.getElementById("theme-selector").style.display = "none";
                    });
                    // Buttons listenerss
                    document.getElementsByClassName("correctButton")[0].addEventListener("mouseup", greenButton);
                    document.getElementsByClassName("wrongButton")[0].addEventListener("mouseup", redButton);
                    // Keyboard listeners
                    document.addEventListener("keydown", keyboardHandler);
                    boucle();
                    return [2 /*return*/];
            }
        });
    });
}
function openDialog(effet) {
    var dialogueDiv = document.createElement("dialog");
    dialogueDiv.classList.add("dialog-container");
    dialogueDiv.id = "dialog-" + effet;
    var content = document.createElement("div");
    var jsonObject = JSON.parse('{"industrie": "Indudu", "agriculture": "agrigri", "transport": "trantran", "logement": "lolo"}');
    content.textContent = jsonObject[effet];
    var closeButton = document.createElement("button");
    closeButton.classList.add("dialog-button");
    closeButton.onclick = function () {
        closeDialog(effet);
    };
    var svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-x-circle\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m15 9-6 6\"/><path d=\"m9 9 6 6\"/></svg>";
    closeButton.innerHTML = (svgString);
    dialogueDiv.appendChild(closeButton);
    dialogueDiv.appendChild(content);
    document.body.appendChild(dialogueDiv);
    dialogueDiv.showModal();
}
function closeDialog(effet) {
    var activeDialog = document.getElementById("dialog-" + effet);
    if (activeDialog) {
        activeDialog.close();
        activeDialog.remove();
    }
}
main();
