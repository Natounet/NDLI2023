class Carte {
    id: number;
    nom: string;
    description: string;
    effets: {
        industrie: number;
        transport: number;
        agriculture: number;
        chauffage: number;
    }
    prerequis: number[];

    constructor(id: number, nom: string, description: string, effets: , prerequis) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.effets = effets;
        this.prerequis = prerequis;
    }


}




