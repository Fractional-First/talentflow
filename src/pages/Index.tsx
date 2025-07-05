
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlurImage } from '@/components/BlurImage';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png" 
            alt="Fractional First" 
            className="h-8 w-auto"
          />
        </div>
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="mr-2"
          >
            Log in
          </Button>
          <Button onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6 animate-slide-up">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-caption font-medium text-primary mb-2">
            Talent Onboarding Platform
          </div>
          
          <h1 className="text-h1 tracking-tight">
            Streamline your career journey with <span className="text-primary">Fractional First</span>
          </h1>
          
          <p className="text-body text-muted-foreground">
            A modern platform that guides you through every step of your professional onboarding experience.
          </p>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="mr-4 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              Start Your Journey
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-12 md:mt-0 animate-blur-in max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-2 shadow-xl">
            <BlurImage
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              alt="Dashboard preview"
              className="rounded-xl w-full h-auto aspect-video object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
