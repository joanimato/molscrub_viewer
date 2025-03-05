

export interface MolscrubInputOptions {
    smiles: string;
    pH: number | null;
}

export const stringifyMolscrubOptions = (input: MolscrubInputOptions) => {
    let smilesString = input.smiles 

    let phSTring = input.pH !== null ? " --pH " + input.pH.toString() : ""

    return (smilesString + phSTring)
}