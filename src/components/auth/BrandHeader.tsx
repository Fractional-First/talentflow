
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
          src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png" 
          alt="Fractional First" 
          className="h-12 w-auto"
        />
      </div>
    </div>
  );
};
