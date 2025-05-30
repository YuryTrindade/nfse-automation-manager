
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

const SaveButton = ({ onSave, isLoading }: SaveButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave} 
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Salvar com Segurança
      </Button>
    </div>
  );
};

export default SaveButton;
