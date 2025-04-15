
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpenCheck, PresentationIcon, Video, ChevronRight } from 'lucide-react';
import { motion } from '@/components/ui/motion';

const HowItWorksDetailedSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Discover How RizzPay Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our detailed technical documentation and demos to understand the powerful technology
            behind our payment processing system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <Video className="h-16 w-16 text-white opacity-80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Technical Demos</h3>
              <p className="text-muted-foreground mb-4 h-20">
                Watch interactive videos showcasing our payment processing technology in action.
              </p>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/how-it-works-technical')}
              >
                <span>Watch Demos</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="h-40 bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
              <BookOpenCheck className="h-16 w-16 text-white opacity-80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Technical Documentation</h3>
              <p className="text-muted-foreground mb-4 h-20">
                Explore our comprehensive technical documentation for a deep dive into our architecture.
              </p>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/how-it-works-technical')}
              >
                <span>View Docs</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="h-40 bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <PresentationIcon className="h-16 w-16 text-white opacity-80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Interactive Presentation</h3>
              <p className="text-muted-foreground mb-4 h-20">
                Explore our interactive presentations designed for investors and technical teams.
              </p>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/how-it-works-technical')}
              >
                <span>View Presentation</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/how-it-works-technical')}
            className="bg-primary hover:bg-primary/90"
          >
            Explore Full Technical Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailedSection;
