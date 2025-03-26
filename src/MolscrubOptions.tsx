
interface TextBoxFormProps {
    formData: { [key: string]: string };
    onFormChange: (field: string, value: string) => void;
  }
  
  const MolscrubOptions: React.FC<TextBoxFormProps> = ({ formData, onFormChange }) => {

    const downloadFile = async (url: string, filename: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };


        // Usage
    const handleDownload = () => {
      downloadFile('dist-electron/electron/test.sdf', 'molscrub.sdf');
    };

    return (
      <form action="submit">
        <div className="scrub-option-form">
            <label>
              pH:
            </label>
            <input
                type="text"
                value={formData.pH || ""}
                onChange={(e) => onFormChange("pH", e.target.value)}
            />
            <label >
              output:
            </label>
            <button onClick={handleDownload}>Download SDF</button>
        </div>
        
        <br />

    </form>
    );
  };

  export default MolscrubOptions