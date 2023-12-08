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

function carteSuivante(): Carte {
    // On cherche a chercher une carte qui n'a pas été joué et dont les prérequis sont satisfait
    let carte: Carte;

    while (true) {
        let random: number = Math.floor(Math.random() * allCartes.length);

        carte = allCartes[random];
        if (!(carte.id in carteJoues) && carte.estJouable()) {
            return carte;
        }
    }
}

function genererAffichageCarte(carte: Carte): string {
    return `<div class="carte"><h3>${carte.nom}</h3><div class="carte_interieur"><p>${carte.description}</p></div></div>`;
}

async function main() {
    allCartes = await creerCarte();
    console.log(allCartes);

    function boucle() {
        let carteActuelle = carteSuivante();
        let cartehtml = genererAffichageCarte(carteActuelle);
        let div = document.createElement("div");

        div.innerHTML = cartehtml;
        document.body.appendChild(div);

        div.addEventListener("mousedown", (event) => {
            // Listen for mousemove events on the document
            document.addEventListener("mousemove", rotateCard);
        });

        // Listen for mouseup events on the document
        let startX: number;

        document.addEventListener("mousedown", (event: MouseEvent) => {
            startX = event.clientX;
            // Listen for mousemove events on the document
            document.addEventListener("mousemove", rotateCard);
        });

        document.addEventListener("mouseup", (event: MouseEvent) => {
            // Remove the mousemove event listener
            document.removeEventListener("mousemove", rotateCard);
            // Check if the card is dragged to the left or right
            let endX = event.clientX;
            let direction = endX > startX ? "right" : "left";

            if (direction == "right") {
                console.log(carteActuelle);
                carteActuelle.boutonVert();
                // add translation to go outside of the screen
                let card = div.getElementsByTagName("div")[0];
                card.style.transition =
                    "transform 1s ease-out, opacity 1s ease-out";
                card.style.transform = `translateX(400%)`;
                card.style.opacity = "0";

                // remove the card from the DOM after the animation is finished
                setTimeout(() => {
                    div.remove();
                }, 1000);
            } else {
                carteActuelle.boutonRouge();
                // add translation to go outside of the screen
                let card = div.getElementsByTagName("div")[0];
                card.style.transition =
                    "transform 1s ease-out, opacity 1s ease-out";
                card.style.transform = `translateX(-400%)`;
                card.style.opacity = "0";

                // remove the card from the DOM after the animation is finished
                setTimeout(() => {
                    div.remove();
                }, 1000);
            }

            if (!partieTermine()) {
                boucle();
            }
        });

        function rotateCard(event: MouseEvent) {
            // Calculate the rotation angle based on the mouse position
            let rotationAngle =
                ((event.clientX - window.innerWidth / 2) /
                    (window.innerWidth / 2)) *
                30; // Adjust the divisor to change the rotation speed

            // Rotate the card
            div.getElementsByTagName(
                "div"
            )[0].style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
        }
    }

    if (partieTermine()) {
        console.log("Game over, no new cards will be generated.");
        return;
    }

    boucle();
}

main();