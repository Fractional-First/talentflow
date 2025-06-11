
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlurImage } from '@/components/BlurImage';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    // Intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Subtle background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 gradient-warm opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Navigation */}
      <header className="nav-sticky">
        <div className="container-width section-padding">
          <div className="flex items-center justify-between">
            <div className="text-fluid-2xl font-bold text-foreground">
              TalentFlow
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-primary"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="btn-primary shadow-soft"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/signup')}
                className="btn-primary"
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="section-padding flex-1 flex items-center">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-on-scroll">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-fluid-sm font-medium">
                <Zap className="h-4 w-4 mr-2" />
                Talent Onboarding Platform
              </div>
              
              <h1 className="text-fluid-3xl font-bold tracking-tight">
                Streamline your career journey with{' '}
                <span className="gradient-warm-text">TalentFlow</span>
              </h1>
              
              <p className="text-fluid-lg text-muted-foreground leading-relaxed max-w-2xl">
                A modern platform that guides you through every step of your professional 
                onboarding experience with clarity, focus, and human insight.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="btn-gradient shadow-medium hover:shadow-large will-change-transform"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <div className="glass-card rounded-2xl p-3 shadow-large will-change-transform">
                <BlurImage
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Dashboard preview showing a clean, modern interface"
                  className="rounded-xl w-full h-auto aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-muted/30">
        <div className="container-width">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-fluid-2xl font-bold mb-4">
              Why Choose TalentFlow?
            </h2>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience a seamless onboarding process designed with empathy, 
              clarity, and your success in mind.
            </p>
          </div>

          <div className="grid-responsive">
            {[
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Human-Centered Design",
                description: "Every interaction is crafted to feel natural, supportive, and focused on your unique journey."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: "Clear Progress Tracking",
                description: "See exactly where you are and what's next with transparent, visual progress indicators."
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: "Effortless Experience",
                description: "Thoughtfully designed workflows that eliminate friction and focus on what matters most."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="card-natural animate-on-scroll p-8 text-center group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-fluid-xl font-semibold mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="gradient-warm rounded-3xl p-12 text-center text-white animate-on-scroll">
            <h2 className="text-fluid-2xl font-bold mb-6">
              Ready to transform your career journey?
            </h2>
            <p className="text-fluid-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have streamlined their onboarding 
              experience with TalentFlow.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-large"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding border-t border-border bg-muted/20">
        <div className="container-width">
          <div className="text-center">
            <div className="text-fluid-lg font-semibold text-foreground mb-2">
              TalentFlow
            </div>
            <p className="text-muted-foreground text-fluid-sm">
              Empowering careers through thoughtful design and human insight.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
