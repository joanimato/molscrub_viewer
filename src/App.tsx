import { useState } from 'react'



import './App.css'
import MoleculeViewer from './MolViewer'
import MolscrubOptions from './MolscrubOptions'


import { Jsme } from '@loschmidt/jsme-react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { stringifyMolscrubOptions, MolscrubInputOptions } from './options'



function App() {

  let default_options: MolscrubInputOptions = {smiles:"", 
    pH: null, 
    write_failed:null,
    name_from_prop:null, 
    skip_acidbase:undefined, 
    skip_tautomers: null, 
    skip_ringfix: null, 
    skip_gen3d:null
  } 


  // Define state of the prgram 
  const [userInput, setUserInput] = useState<MolscrubInputOptions>(default_options); // Track user input
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  // const [scrubOptions, setScrubOptions] = useState<{ [key: string]: string }>({
  //   pH: ""
  // });
  const [scrubOptions, setScrubOptions] = useState<MolscrubInputOptions>(default_options)


  const handleFormChange = (field: string, value: string | boolean) => {
    // update scrub options 
    setScrubOptions((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    // update user Input state
    setUserInput((prevInput) => ({
      ...prevInput, 
      [field]: value
    }))

    //debug
    console.log(userInput)
    console.log(scrubOptions)
    console.log(stringifyMolscrubOptions(userInput))
    console.log(userInput["smiles"])
  };
  
  
  const waitForFile = async (attempts = 10) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await fetch("http://127.0.0.1:8000/check-file");
        const data = await response.json();
        if (data.exists) return true; // File is ready
      } catch (err) {
        console.error("Error checking file:", err);
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); 
    }
    return false; 
  };

  // This makes request to the python server that runs molscrub
  const runPythonScript = async () => {
    try {
      let input = stringifyMolscrubOptions(userInput)
      console.log(input)
      const response = await fetch("http://127.0.0.1:8000/run-script", 
        {method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_text: input})}
      );

      const data = await response.json();
      setOutput(data.output || "No output");

      // update state of refresh to trigger re-render
      setError(data.error || "");

      const fileReady = await waitForFile()

      if(fileReady) {
        console.log("File ready! Reloading Viewer...");
        setTimeout( () => {
          setRefreshTrigger( (prev) => prev + 1)
        }, 300); 
        
      } else {
        console.error("Timeout: test.sdf was not found.");
        setError("Timeout: test.sdf was not generated.");
      }
    } catch (err) {
      setError("Failed to run script");
    }
  };

  const handleDrawing = (s: string) => {
    setUserInput((prevInput) => ({...prevInput, smiles:s}))
  }


  return (
    <>

    <h1 className='title'>Molscrub Viewer</h1>
    <hr></hr>
    <PanelGroup direction='horizontal' className='main-panel'>
    
    <Panel id="leftbar" minSize={10} maxSize={35} defaultSize={30} collapsible={true} collapsedSize={5}>
        Molscrub Options
        <br/> <br/>
        <br></br>
        <div className='scrub-option-form'>
          <div className="normal-text"> Molscrub Output </div>
          <div className='log-text'>
            {output && <pre>Output: {output}</pre>}
            {error && <pre style={{ color: "red" }}>{error}</pre>}
          </div>
        </div>
        <br />
        <MolscrubOptions formData={scrubOptions} onFormChange={handleFormChange}></MolscrubOptions>
    </Panel>
    <PanelResizeHandle  style={{color: "black"}}/>
    <Panel id="main" minSize={50}>
    <div className='container-main'> 
  
        <div className="card">
          <Jsme height="350px" width="400px" options="oldlook,star" onChange={handleDrawing} />
        </div>

        <div className="card">
          <div className='smiles-entry'>
            <input
              type="text"
              value={userInput.smiles}
              onChange={(e) => setUserInput( (prev) => ({...prev, smiles:e.target.value}))}
              placeholder="Enter smiles"
            />
            <button onClick={runPythonScript}>run Scrub.py</button>
          </div>

          <div className='mol-wrapper'>
            <MoleculeViewer pdbUrl="../dist-electron/electron/test.sdf"
              key={refreshTrigger}/>
          </div>
        </div>

      
    </div>
    </Panel>
    </PanelGroup>

    </>
  )
}

export default App
