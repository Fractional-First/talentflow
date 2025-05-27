
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlurImage } from '@/components/BlurImage';
import { Users, Rocket, Settings, Briefcase } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Talent Onboarding",
      description: "Streamlined onboarding process that guides new talent through every step of their journey with personalized experiences."
    },
    {
      icon: Briefcase,
      title: "Career Matching",
      description: "Advanced matching algorithms that connect talented individuals with the perfect opportunities based on skills and preferences."
    },
    {
      icon: Rocket,
      title: "Growth Acceleration",
      description: "Comprehensive tools and resources to accelerate professional growth and unlock career potential."
    },
    {
      icon: Settings,
      title: "Process Optimization",
      description: "Automated workflows and smart systems that optimize the entire talent acquisition and development process."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-xl font-semibold">TalentFlow</div>
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
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary mb-2">
            Talent Onboarding Platform
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Streamline your career journey with <span className="text-primary">TalentFlow</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
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
              Let's Explore
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
      
      {/* What We Do Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TalentFlow revolutionizes the way organizations discover, onboard, and develop talent through innovative technology and streamlined processes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="glass-card rounded-2xl p-6 text-center hover:shadow-medium transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
