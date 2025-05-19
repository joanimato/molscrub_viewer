
type ScrubOption = string | number | boolean | null | undefined

export interface MolscrubInputOptions {
    smiles: string;
    pH: number | null;
    write_failed: string | null;
    name_from_prop: string | null;
    skip_acidbase: boolean | undefined;
    skip_tautomers: boolean | null; 
    skip_ringfix: boolean | null; 
    skip_gen3d: boolean | null;
    ring_energies: boolean | null; 
    cpu: number | null; 
    debug: boolean | null; 
}


const notNullorEmtpy = (predicate: ScrubOption): boolean => {
    return predicate != null && predicate != undefined && predicate != ""
}

const scrubToString = (prepend_text:string, molscrubOption: ScrubOption) => {
    return notNullorEmtpy (molscrubOption) ? prepend_text + " " + molscrubOption?.toString() + " " : ""
}

export const stringifyMolscrubOptions = (input: MolscrubInputOptions) => {
    let outputString = ""

    // smiles input 
    outputString += input.smiles + " "


    //ph input
    outputString += scrubToString("--ph", input.pH) 

    // write_failed_mols options
    outputString += scrubToString("--write_failed_mols", input.write_failed)
    
    // write_failed_mols options
    outputString += scrubToString("--name_from_prop", input.name_from_prop)

    //hardcoded output here to "test.sdf"
    outputString += " -o test.sdf "

    // skip_acidbase
    outputString += input.skip_acidbase ? " --skip_acidbase "  : ""

    // skip_tautomers
    outputString += input.skip_tautomers ? " --skip_tautomers "  : ""

    // skip_tautomers
    outputString += input.skip_ringfix ? " --skip_ringfix "  : ""

    // skip_tautomers
    outputString += input.skip_gen3d ? " --skip_gen3d "  : ""

    // skip_tautomers
    outputString += input.ring_energies ? " --ring_minimize "  : ""

    // cpus
    outputString += scrubToString("--cpu", input.cpu )

    // debug
    outputString += input.debug? " --debug "  : ""


    return outputString
}