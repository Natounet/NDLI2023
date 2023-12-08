let industrie = 50;
let transport = 50;
let agriculture = 50;
let logement = 50;

let carteJoues: number[] = [];
let carteActuelle: Carte;
let boutonVertRestant: number = 10;

// Main logic

type effet = {
    industrie: number;
    transport: number;
    agriculture: number;
    logement: number;
};

enum type {
    info,
    action
}

class Carte {
    id: number;
    nom: string;
    description: string;
    effets: effet;
    prerequis: number[];
    source: string;
    info: string;
    type: type;

    constructor(
        id: number,
        nom: string,
        description: string,
        effets: effet,
        prerequis: number[],
        source: string,
        info: string,
        type: type,
    ) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
        this.info = info;
        this.type = type;
    }

    boutonVert() {
        if (this.type == type.info) return;

        if (boutonVertRestant > 0) {
            // Vérification si les prérequis sont satisfait.
            if (this.estJouable()) {
                agriculture += this.effets.agriculture;
                industrie += this.effets.industrie;
                transport += this.effets.transport;
                logement += this.effets.logement;

                carteJoues.push(this.id);
            }

            const svgContainerLogement = document.querySelector('.svg-container.logement') as HTMLElement;

            if (svgContainerLogement) {
                const firstSvg = svgContainerLogement.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 " + (100 - logement) + "%, 100% " + (100 - logement) + "%, 100% 100%, 0 100%)";
            }

            const svgContainerTransport = document.querySelector('.svg-container.transport') as HTMLElement;

            if (svgContainerTransport) {
                const firstSvg = svgContainerTransport.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 " + (100 - transport) + "%, 100% " + (100 - transport) + "%, 100% 100%, 0 100%)";
            }

            const svgContainerIndustrie = document.querySelector('.svg-container.industrie') as HTMLElement;

            if (svgContainerIndustrie) {
                const firstSvg = svgContainerIndustrie.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 " + (100 - industrie) + "%, 100% " + (100 - industrie) + "%, 100% 100%, 0 100%)";
            }

            const svgContainerAgriculture = document.querySelector('.svg-container.agriculture') as HTMLElement;

            if (svgContainerAgriculture) {
                const firstSvg = svgContainerAgriculture.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 " + (100 - agriculture) + "%, 100% " + (100 - agriculture) + "%, 100% 100%, 0 100%)";
            }

            boutonVertRestant -= 1;
        }
    }

    boutonRouge() {
        if (this.type == type.info) return;

        // Vérification si les prérequis sont satisfait.
        if (this.estJouable()) {
            agriculture -= this.effets.agriculture;
            industrie -= this.effets.industrie;
            transport -= this.effets.transport;
            logement -= this.effets.logement;

            carteJoues.push(this.id);
        }
    }

    estJouable(): boolean {
        this.prerequis.forEach((pr) => {
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

    const response = await fetch("cartes.json");

    let data = await response.json();
    let cartes = Object.values(data);

    cartes.forEach((obj: any) =>
        allCartes.push(
            new Carte(
                obj.id,
                obj.nom,
                obj.description,
                obj.effets,
                obj.prerequis,
                obj.source,
                obj.info,
                obj.type
            )
        )
    );

    return allCartes;
}

function partieTermine(): boolean {
    return (
        (industrie > 100 ||
            transport > 100 ||
            agriculture > 100 ||
            logement > 100) &&
        carteJoues.length <= allCartes.length
        || boutonVertRestant == 0
    );
}

function carteSuivante(): Carte | null {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait

    for (let i = 0; i < allCartes.length; i++) {
        if (!carteJoues.includes(i) && allCartes[i].estJouable()) {
            return allCartes[i];
        }
    }

    console.log("Je n'ai pas trouvé de carte candidate..");
    return null;


}

function genererAffichageCarte(carte: Carte): string {
    return `<div class="carte"><h2>${carte.nom}</h2><div class="carte_interieur"><p>${carte.description}</p></div></div>`;
}

let div;
let startX: number = 0;
let isClicked: boolean = false;
let index: number = 0;


function boucle() {
    if (partieTermine()) {
        let carteActuelle = null;
    };

    if (index == 0) {
        carteActuelle = allCartes[0]
    }

    carteActuelle = carteSuivante()!;

    if (carteActuelle == null) {
        console.log("Il n'y a plus de cartes candidates.");
        return;
    }

    // Création de la carte dans le DOM
    let cartehtml = genererAffichageCarte(carteActuelle);
    div = document.createElement("div");
    div.innerHTML = cartehtml;

    // The card come from under the screen

    // Ajout de la carte dans le DOM
    document.body.appendChild(div);
    let a = document.body.getElementsByClassName("carte")[0] as HTMLElement;
    a.style.transform = `translateY(100%) translateX(-50%)`;

    // Force a reflow to make sure the initial state is applied
    void a.offsetWidth;

    a.style.transition = "transform 0.6s ease-in-out";
    a.style.transform = `translateY(0%) translateX(-50%)`;

    // Ajout de l'event listener pour le drag
    div.addEventListener("mousedown", (event) => {
        isClicked = true;
        // Listen for mousemove events on the document
        startX = event.clientX;
    });


    index++;


}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function actionCarte(event: MouseEvent) {

    if (partieTermine()) {
        let carteActuelle = null;
    };
    // Listen to mouseup events on the document
    let endX = event.clientX;

    if (isClicked == false) return;

    isClicked = false;


    let direction = endX > startX ? "right" : "left";
    if (direction == "right") {
        if (carteActuelle == null) {
            console.log("Game over, no new cards will be generated.");
            return;
        }
        else {
            carteActuelle.boutonVert();
        }
        // add translation to go outside of the screen
        let card = div.getElementsByTagName("div")[0];
        card.style.transition =
            "transform 1s ease-out, opacity 1s ease-out";
        card.style.transform = `translateX(400%)`;
        card.style.opacity = "0";

        // remove the card from the DOM after the animation is finished


    } else {

        if (carteActuelle == null) {
            console.log("Game over, no new cards will be generated.");
            return;
        }
        else {
            carteActuelle.boutonRouge();
        }                // add translation to go outside of the screen
        let card = div.getElementsByTagName("div")[0];
        card.style.transition =
            "transform 1s ease-out, opacity 1s ease-out";
        card.style.transform = `translateX(-400%)`;
        card.style.opacity = "0";

        // remove the card from the DOM after the animation is finished



    }

    await delay(1000);
    div.remove();

    if (!partieTermine()) {
        boucle();
    } else {
        let rickrollDiv = document.createElement("div");
        rickrollDiv.innerHTML = `<img src="../assets/rickroll.gif">`;
        rickrollDiv.style.position = "fixed";
        rickrollDiv.style.left = "50%";
        rickrollDiv.style.transform = "translateX(-50%)";
        rickrollDiv.style.zIndex = '999';
        document.body.appendChild(rickrollDiv);
    }

}


function rotateCard(event: MouseEvent) {
    if (partieTermine()) {
        let carteActuelle = null;
    };
    if (!isClicked || div == null) return;
    // Calculate the rotation angle based on the mouse position
    let rotationAngle =
        ((event.clientX - window.innerWidth / 2) /
            (window.innerWidth / 2)) *
        30; // Adjust the divisor to change the rotation speed



    let tkt = div.getElementsByTagName("div")[0];
    tkt.style.transition = "none";
    tkt.style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
}

async function greenButton(event: MouseEvent) {
    if (partieTermine()) {
        let carteActuelle = null;
    };

    if (carteActuelle == null) {
        console.log("Game over, no new cards will be generated.");
        return;
    }
    else {
        carteActuelle.boutonVert();
    }
    // add translation to go outside of the screen
    let card = div.getElementsByTagName("div")[0];
    card.style.transition =
        "transform 1s ease-out, opacity 1s ease-out";
    card.style.transform = `translateX(400%)`;
    card.style.opacity = "0";

    await delay(1000);
    div.remove();

    if (!partieTermine()) {
        boucle();
    }
}

async function redButton(event: MouseEvent) {
    if (partieTermine()) {
        let carteActuelle = null;
    };

    if (carteActuelle == null) {
        console.log("Game over, no new cards will be generated.");
        return;
    }
    else {
        carteActuelle.boutonRouge();
    }                // add translation to go outside of the screen
    let card = div.getElementsByTagName("div")[0];
    card.style.transition =
        "transform 1s ease-out, opacity 1s ease-out";
    card.style.transform = `translateX(-400%)`;
    card.style.opacity = "0";

    await delay(1000);
    div.remove();

    if (!partieTermine()) {
        boucle();
    }
}

async function keyboardHandler(event: KeyboardEvent) {
    if (partieTermine()) {
        let carteActuelle = null;
    };

    // Arrow and D and Q
    if (event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "d" || event.key == "q") {
        if (event.key == "ArrowLeft" || event.key == "q") {
            redButton(event as unknown as MouseEvent);
        } else {
            greenButton(event as unknown as MouseEvent);
        }
    }

}

async function main() {
    allCartes = await creerCarte();

    // Cards listeners
    document.addEventListener("mousemove", rotateCard);
    document.addEventListener("mouseup", actionCarte);


    const root = document.querySelector(':root') as HTMLElement;
    document.getElementById("theme-button")!.addEventListener("click", () => {
        let val = document.getElementById("theme-selector")!.style.display;
        document.getElementById("theme-selector")!.style.display = val == "none" ? "block" : "none";
    });

    // Theme buttons listeners
    document.getElementById("classic-theme-btn")?.addEventListener("click", () => {
        root.style.setProperty('--primary-color', '#1A4536');
        root.style.setProperty('--accent-green', '#3fe97d');
        root.style.setProperty('--accent-saumon', '#FF9999');
        root.style.setProperty('--secondary-color', '#1B7958');
        document.body.style.background = "var(--primary-color)";
        document.body.style.animation = "none";
        const audioElement = document.querySelector(".audio-tag");
        if (audioElement) {
            document.body.removeChild(audioElement);
        }
        document.getElementById("theme-selector")!.style.display = "none";
    })

    document.getElementById("contrast-theme-btn")?.addEventListener("click", () => {
        root.style.setProperty('--primary-color', '#0E271E');
        root.style.setProperty('--accent-green', '#DCEA3B');
        root.style.setProperty('--accent-saumon', '#0E271E');
        root.style.setProperty('--secondary-color', '#0E271E');
        document.body.style.background = "var(--primary-color)";
        document.body.style.animation = "none";
        const audioElement = document.querySelector(".audio-tag");
        if (audioElement) {
            document.body.removeChild(audioElement);
        }
        document.getElementById("theme-selector")!.style.display = "none";
    })

    document.getElementById("disco-theme-btn")?.addEventListener("click", () => {
        root.style.setProperty('--primary-color', '#ffbf66');
        root.style.setProperty('--accent-green', '');
        root.style.setProperty('--accent-saumon', '#00353f');
        root.style.setProperty('--secondary-color', '#08c5d1');
        document.body.style.backgroundSize = "1000%";
        document.body.style.backgroundPosition = "left";
        document.body.style.animation = "10s discoBg ease infinite";
        const audio = document.createElement("audio");
        audio.classList.add("audio-tag");
        audio.src = '../assets/discoMusic.mp3';
        audio.autoplay = true; // Add the autoplay attribute to play the audio automatically
        document.body.appendChild(audio);
        document.getElementById("theme-selector")!.style.display = "none";
    })

    // Buttons listenerss
    document.getElementsByClassName("correctButton")[0].addEventListener("mouseup", greenButton as unknown as EventListener);
    document.getElementsByClassName("wrongButton")[0].addEventListener("mouseup", redButton as unknown as EventListener);

    // Keyboard listeners
    document.addEventListener("keydown", keyboardHandler);

    boucle();
}



function openDialog(effet: string) {
    let dialogueDiv = document.createElement("dialog");
    dialogueDiv.classList.add("dialog-container");
    dialogueDiv.id = "dialog-" + effet;

    let content = document.createElement("div")
    var jsonObject = JSON.parse('{"industrie": "En France, l\'industrie représente 40% des émissions de gaz à effets de serres. ", "agriculture": "En France, l\'agriculture représente 25% des émissions de gaz à effets de serre.", "transport": "En France, le transport représente 15% des émissions de gaz à effets de serre.", "logement": "En France, l\'utilisation des bâtiments représente 20% des émissions de gaz à effets de serre."}');
    content.textContent = jsonObject[effet];

    let closeButton = document.createElement("button");
    closeButton.classList.add("dialog-button");
    closeButton.onclick = function () {
        closeDialog(effet);
    };

    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
    closeButton.innerHTML = (svgString);
    dialogueDiv.appendChild(closeButton);
    dialogueDiv.appendChild(content);
    document.body.appendChild(dialogueDiv);
    (dialogueDiv as HTMLDialogElement).showModal();
}


function closeDialog(effet: string) {
    let activeDialog = document.getElementById("dialog-" + effet);
    if (activeDialog) {
        (activeDialog as HTMLDialogElement).close();
        activeDialog.remove();
    }
}

main();