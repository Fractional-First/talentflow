
import { useNavigate } from 'react-router-dom';

export const BrandHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mb-2">
      <div 
        className="inline-block cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <span className="text-2xl font-semibold">TalentFlow</span>
      </div>
    </div>
  );
};
