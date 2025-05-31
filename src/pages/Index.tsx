
import { useState } from "react";
import { ChevronDown, Menu, X, Phone, Clock, Shield, Users, Zap, MapPin, Heart, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EmergencyModal from "@/components/EmergencyModal";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Initialize GSAP scroll animations
  useScrollAnimations();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const whoWeHelp = [
    {
      icon: Users,
      title: "Vehicle Drivers",
      description: "One-click emergency alert or auto-trigger via sensors.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Heart,
      title: "Ambulance Drivers",
      description: "Get notified, navigate, and rescue efficiently.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Hospital Admins",
      description: "Accept patients instantly with access to driver data & live location.",
      color: "from-green-500 to-green-600"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Accident Triggered",
      description: "Emergency detected via sensor or manual activation",
      icon: Zap
    },
    {
      step: "02",
      title: "Ambulance Notified",
      description: "Nearby ambulances receive instant alert with location",
      icon: Phone
    },
    {
      step: "03",
      title: "Hospital Accepts",
      description: "Hospital admin receives and confirms patient request",
      icon: Shield
    },
    {
      step: "04",
      title: "Live Tracking",
      description: "Real-time ambulance location shared with hospital",
      icon: MapPin
    },
    {
      step: "05",
      title: "Patient Delivered",
      description: "Safe arrival with direct hospital admin contact",
      icon: Heart
    }
  ];

  const keyFeatures = [
    {
      icon: Phone,
      title: "Emergency Family Contact",
      description: "Automatic notification to family members in real-time"
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Live ambulance location updates for hospitals"
    },
    {
      icon: Zap,
      title: "Smart Reassignment",
      description: "Automatic re-routing if ambulance breaks down"
    },
    {
      icon: Shield,
      title: "Direct Hospital Contact",
      description: "One-click calling to hospital administrators"
    },
    {
      icon: Users,
      title: "Secure Role Registration",
      description: "Protected user authentication for all stakeholders"
    },
    {
      icon: Clock,
      title: "Role-based Data Access",
      description: "Secure Firestore data management by user roles"
    }
  ];

  const faqs = [
    {
      question: "How does the sensor trigger work?",
      answer: "Our smart sensors detect sudden impact, airbag deployment, or dramatic changes in vehicle orientation. When triggered, they automatically send an emergency alert with GPS coordinates to our system."
    },
    {
      question: "Can users cancel an emergency request?",
      answer: "Yes, users have a brief window to cancel false alarms. However, once an ambulance is dispatched, cancellation requires confirmation to ensure no genuine emergencies are missed."
    },
    {
      question: "What if the ambulance crashes mid-way?",
      answer: "Our system continuously monitors ambulance status. If an ambulance becomes unresponsive or reports an issue, the emergency is automatically reassigned to the next nearest available ambulance."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and comply with healthcare data protection standards. Your information is only shared with authorized emergency responders when needed."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LifeLine</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors text-left"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors text-left"
                >
                  How It Works
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                      Register
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-blue-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Accident
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700"> Response </span>
              System
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Save lives faster by connecting vehicles, ambulances, and hospitals in real time.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg"
                onClick={() => scrollToSection('how-it-works')}
              >
                Explore How It Works
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 text-lg"
                onClick={() => setIsEmergencyModalOpen(true)}
              >
                Get Help Now
                <Phone className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Help</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects all key stakeholders in emergency response
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whoWeHelp.map((item, index) => (
              <Card key={index} className="animate-card group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and efficient emergency response in 5 steps
            </p>
          </div>

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
            {workflowSteps.map((step, index) => (
              <div key={index} className="workflow-step relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 relative">
                    <step.icon className="w-8 h-8 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-2 w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}

      <section id="key-features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology ensuring rapid and reliable emergency response
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="animate-card group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Our Mission</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Every second counts in an emergency. Our Smart Accident Response System revolutionizes 
                how we handle vehicle accidents by creating a seamless connection between drivers, 
                ambulances, and hospitals.
              </p>
              <p>
                By digitizing emergency response, we eliminate communication delays, reduce response times, 
                and ensure that help reaches those who need it most. Our commitment to speed and safety 
                drives every feature we build.
              </p>
              <p>
                Together, we're building a safer future where technology saves lives, one emergency at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our emergency response system
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-red-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">LifeLine</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing emergency response through smart technology and seamless connectivity.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Support", "GitHub"].map((link) => (
                  <a key={link} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Technology</h3>
              <p className="text-gray-400 mb-4">Built with modern technologies:</p>
              <div className="space-y-1 text-sm text-gray-400">
                <div>• Next.js & TypeScript</div>
                <div>• Firebase & Real-time Database</div>
                <div>• TailwindCSS & Responsive Design</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LifeLine. All rights reserved. Saving lives through technology.</p>
          </div>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
