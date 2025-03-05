import { useEffect, useRef ,useState } from "react";
import * as $3Dmol from "3dmol"; // Import 3Dmol.js

interface MoleculeViewerProps {
  pdbUrl: string;
}

const MoleculeViewer = ({ pdbUrl}: MoleculeViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<$3Dmol.GLViewer | null>(null); // Store the viewer instance


  const [frameNum, setFrameNum] = useState<number>(0)
  const [totalFrames, setTotalFrames] = useState<number>(0)

  const increaseFrameNum = (currentFrame: number, numFrames: number) => {
    if (currentFrame < numFrames - 1) {
      setFrameNum(currentFrame + 1)
    }
  }

  const decreaseFrameNum = (currentFrame: number) => {
    if (currentFrame > 0) {
      setFrameNum (currentFrame - 1)
    }
  }

  useEffect(() => {
    if (!viewerRef.current) return;

    if (viewerInstance.current) {
      viewerInstance.current.clear(); // Remove all existing molecules
      viewerInstance.current = null; // Clear reference
    }

    // create new viewer instance
    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "black",
    });

    viewerInstance.current = viewer;


    fetch(pdbUrl)
      .then((response) => response.text())
      .then((data) => {
        viewer.clear()
        viewer.addModelsAsFrames(data, "sdf"); // Load molecule
        setTotalFrames(viewer.getNumFrames())
        viewer.setFrame(0)
        viewer.setStyle({}, { stick: {} }); // Set visualization style
        viewer.zoomTo();
        viewer.render();
        viewer.resize();
      })
      .catch((error) => console.error("Failed to load file:", error));
    
    
    return () => {
        // Cleanup when component unmounts or updates
      if (viewerInstance.current) {
        viewerInstance.current.clear();
        viewerInstance.current = null;
      }
    };
  }, [pdbUrl]);

  useEffect(() => {
    if (viewerInstance.current) {
      viewerInstance.current.setFrame(frameNum);
      viewerInstance.current.render();
      viewerInstance.current.resize();
    }
  }, [frameNum]); // This ensures frame updates

  return (
    <>
    <div className="viewer-nav">
      <button onClick={() => decreaseFrameNum(frameNum) }>  &lt; </button>
      <span style={{minWidth: "50px", alignContent:"center"}}> {frameNum + 1} </span>
      <button onClick={() => increaseFrameNum(frameNum, totalFrames)}> &gt; </button>
    </div>
    <div ref={viewerRef} className="mol-viewer"
    style={{ //width: "100%", height: "100%", 
             position: "relative"}} 
             />
    </>
  );
}

export default MoleculeViewer;
