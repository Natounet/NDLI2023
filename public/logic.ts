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

class Carte {
    id: number;
    nom: string;
    description: string;
    effets: effet;
    prerequis: number[];
    source: string;
    info: string;

    constructor(
        id: number,
        nom: string,
        description: string,
        effets: effet,
        prerequis: number[],
        source: string,
        info: string
    ) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
        this.source = source;
        this.info = info;
    }

    boutonVert() {
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
                obj.info
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



    div.getElementsByTagName(
        "div"
    )[0].style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
}

async function main() {
    allCartes = await creerCarte();

    document.addEventListener("mousemove", rotateCard);
    document.addEventListener("mouseup", acionCarte) ;

    boucle();
}

main();