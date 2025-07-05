
import { useNavigate } from 'react-router-dom';

export const BrandHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mb-2">
      <div 
        className="inline-block cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <img 
          src="/lovable-uploads/d41b4a66-0c4b-46f6-9452-81c8d948d25f.png" 
          alt="Fractional First" 
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
};
