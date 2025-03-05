import { useEffect, useRef, useState } from "react";

const JSMEEditor = ({ width = 500, height = 400, onChange }: { width?: number; height?: number; onChange?: (mol: string) => void }) => {

  const editorRef = useRef<HTMLDivElement>(null);
  const jsmeInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load JSME script only once
    if (!document.querySelector("#jsme-script")) {
      const script = document.createElement("script");
      script.id = "jsme-script";
      script.src = "https://jsme-editor.github.io/dist/jsme/jsme.nocache.js"; // Load JSME from online source
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !editorRef.current) return;

    // Initialize JSME after script loads
    const editorId = "jsme-container";
    editorRef.current.innerHTML = `<div id="${editorId}" style="width: ${width}px; height: ${height}px;"></div>`;

    jsmeInstance.current = new (window as any).JSME(editorId, `${width}px`, `${height}px`, {});

    // Handle molecule changes
    if (onChange) {
      jsmeInstance.current.setCallBack("MolChange", () => {
        const mol = jsmeInstance.current?.molFile();
        onChange(mol);
      });
    }
  }, [isLoaded, width, height, onChange]);

  return <div ref={editorRef} />;
};

export default JSMEEditor;
