

export interface MolscrubInputOptions {
    smiles: string;
    pH: number | null;
    write_failed: string | null;
    name_from_prop: string | null;
    skip_acidbase: boolean | undefined;
    skip_tautomers: boolean | null; 
    skip_ringfix: boolean | null; 
    skip_gen3d: boolean | null; 
}

const notNullorEmtpy = (predicate: any) => {
    return predicate !=null && predicate != undefined && predicate != ""
}


export const stringifyMolscrubOptions = (input: MolscrubInputOptions) => {
    let outputString = ""

    // smiles input 
    outputString += input.smiles 

    //ph input
    outputString += input.pH !== null ? " --pH " + input.pH.toString() : ""

    // write_failed_mols options
    outputString += input.write_failed !== null ? " --write_failed_mols " + input.write_failed.toString() : ""
    
    // write_failed_mols options
    outputString += input.name_from_prop !== null ? " --name_from_prop " + input.name_from_prop.toString() : ""

    // skip_acidbase
    outputString += input.skip_acidbase ? " --skip_acidbase "  : ""

    // skip_tautomers
    outputString += input.skip_tautomers ? " --skip_tautomers "  : ""

    // skip_tautomers
    outputString += input.skip_ringfix ? " --skip_ringfix "  : ""

    // skip_tautomers
    outputString += input.skip_gen3d ? " --skip_gen3d "  : ""

    return outputString
}