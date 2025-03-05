
interface TextBoxFormProps {
    formData: { [key: string]: string };
    onFormChange: (field: string, value: string) => void;
  }
  
  const MolscrubOptions: React.FC<TextBoxFormProps> = ({ formData, onFormChange }) => {
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
        </div>
        
        <br />

    </form>
    );
  };

  export default MolscrubOptions