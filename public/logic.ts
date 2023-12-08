let industrie = 0;
let transport = 0;
let agriculture = 0;
let logement = 0;

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
        if(this.type == type.info) return;

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
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 "+(100-logement)+"%, 100% "+(100-logement)+"%, 100% 100%, 0 100%)";
            }

            const svgContainerTransport = document.querySelector('.svg-container.transport') as HTMLElement;

            if (svgContainerTransport) {
                const firstSvg = svgContainerTransport.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 "+(100-transport)+"%, 100% "+(100-transport)+"%, 100% 100%, 0 100%)";
            }

            const svgContainerIndustrie = document.querySelector('.svg-container.industrie') as HTMLElement;

            if (svgContainerIndustrie) {
                const firstSvg = svgContainerIndustrie.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 "+(100-industrie)+"%, 100% "+(100-industrie)+"%, 100% 100%, 0 100%)";
            }

            const svgContainerAgriculture = document.querySelector('.svg-container.agriculture') as HTMLElement;

            if (svgContainerAgriculture) {
                const firstSvg = svgContainerAgriculture.querySelector('.first') as SVGElement;
                if (firstSvg) firstSvg.style.clipPath = "polygon(0 "+(100-agriculture)+"%, 100% "+(100-agriculture)+"%, 100% 100%, 0 100%)";
            }

            boutonVertRestant -= 1;
        }
    }

    boutonRouge() {
        if(this.type == type.info) return;

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
    return `<div class="carte"><h3>${carte.nom}</h3><div class="carte_interieur"><p>${carte.description}</p></div></div>`;
}

let div;
let startX: number = 0;
let isClicked: boolean = false;


function boucle() {

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




    
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function acionCarte(event: MouseEvent){

    // Listen to mouseup events on the document
    let endX = event.clientX;
    
    if(isClicked == false) return;

    isClicked = false;


    let direction = endX > startX ? "right" : "left";
    if (direction == "right") {
        console.log(carteActuelle);
        if(carteActuelle == null) {
            console.log("Game over, no new cards will be generated.");
            return;
        }
        else{
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

        if(carteActuelle == null) {
            console.log("Game over, no new cards will be generated.");
            return;
        }
        else{
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
    }

}


function rotateCard(event: MouseEvent) {
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


async function main() {
    allCartes = await creerCarte();

    document.addEventListener("mousemove", rotateCard);
    document.addEventListener("mouseup", acionCarte) ;


    const root = document.querySelector(':root') as HTMLElement;
    document.getElementById("theme-button")!.addEventListener("click", () => {
        let val = document.getElementById("theme-selector")!.style.display;
        document.getElementById("theme-selector")!.style.display = val == "none" ? "block" : "none";
    });

    document.getElementById("classic-theme-btn")?.addEventListener("click", () => {
        root.style.setProperty('--primary-color', '#1A4536');
        root.style.setProperty('--accent-green', '#3fe97d');
        root.style.setProperty('--accent-saumon', '#FF9999');
        root.style.setProperty('--secondary-color', '#1B7958');
        document.getElementById("theme-selector")!.style.display = "none";
    })
    
    document.getElementById("contrast-theme-btn")?.addEventListener("click", () => {
        root.style.setProperty('--primary-color', '#0E271E');
        root.style.setProperty('--accent-green', '#DCEA3B');
        root.style.setProperty('--accent-saumon', '#0E271E');
        root.style.setProperty('--secondary-color', '#0E271E');
        document.getElementById("theme-selector")!.style.display = "none";
    })

    boucle();
}

function openDialog(effet: string) {
    let dialogueDiv = document.createElement("dialog");
    dialogueDiv.classList.add("dialog-container");
    dialogueDiv.id = "dialog-" + effet;

    let content = document.createElement("div")
    var jsonObject = JSON.parse('{"industrie": "Indudu", "agriculture": "agrigri", "transport": "trantran", "logement": "lolo"}');
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
    console.log('test');
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