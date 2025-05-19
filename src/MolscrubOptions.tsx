
import { MolscrubInputOptions } from './options'

interface TextBoxFormProps {
    formData: MolscrubInputOptions;
    onFormChange: (field: string, value: string | boolean) => void;
  }
  
  const MolscrubOptions: React.FC<TextBoxFormProps> = ({ formData, onFormChange }) => {

    // download test.sdf file from temp directory that it is saved in
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
          <details className="detail-form">
            <summary> Basic options</summary>

              <label>
                pH:
              </label>
              <input
                  type="text"
                  title='pH value for acid/base transformations'
                  value={formData.pH || ""}
                  onChange={(e) => onFormChange("pH", e.target.value)}
              />


            <label>
              Writed Failed Mols:
            </label>
            <input
                type="text"
                value={formData.write_failed || ""}
                onChange={(e) => {onFormChange("write_failed", e.target.value)}}
            />
            <label>
              Name From Prop:
            </label>
            <input
                type="text"
                value={formData.name_from_prop || ""}
                onChange={(e) => {onFormChange("name_from_prop", e.target.value)}}
            />
            <div className='checkbox-input'>
              <label>
                Skip Acid/Base:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.skip_acidbase || false}
                  onChange={(_) => {onFormChange("skip_acidbase", !formData.skip_acidbase)}}
              />
            </div>
            <div className='checkbox-input'>
              <label>
                Skip Tautomers:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.skip_tautomers || false}
                  onChange={(_) => { onFormChange("skip_tautomers", !formData.skip_tautomers)}}
              />
            </div>
            <div className='checkbox-input'>
              <label>
                Skip Ringfix:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.skip_ringfix || false}
                  onChange={(_) => { onFormChange("skip_ringfix", !formData.skip_ringfix)}}
              />
            </div>
            <div className='checkbox-input'>
              <label>
                Skip Gen3d:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.skip_gen3d || false}
                  onChange={(_) => { onFormChange("skip_gen3d", !formData.skip_gen3d)}}
              />
            </div>
            <div className='checkbox-input'>
              <label>
                Ring Energies:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.ring_energies || false}
                  onChange={(_) => { onFormChange("ring_energies", !formData.ring_energies)}}
              />
            </div>
          </details>
          <br />
          <details className="detail-form">
          <summary> Misc Options</summary>
          <br></br>
          <label>
              CPUs:
            </label>
            <input
                type="text"
                value={formData.cpu || ""}
                onChange={(e) => {onFormChange("cpu", e.target.value)}}
            />
            <div className='checkbox-input'>
              <label>
                Debug:
              </label>
              <input 
                  type="checkbox"
                  checked={formData.debug || false}
                  onChange={(_) => { onFormChange("debug", !formData.debug)}}
              />
            </div>
          </details>

          <br />
          <details className="detail-form">
          <summary> Advanced Options</summary>
          </details>
            <br></br>
            <label >
            </label>

            <button onClick={handleDownload}>Download SDF</button>
        </div>
        
        <br />

    </form>
    );
  };

  export default MolscrubOptions