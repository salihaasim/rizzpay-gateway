
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { motion } from '@/components/ui/motion';

const testimonials = [
  {
    quote: "RizzPay's API integration with our PHP backend was incredibly straightforward. We were up and running in less than a day.",
    author: "Raj Sharma",
    position: "CTO, TechBazaar",
    delay: 0.1
  },
  {
    quote: "The domestic payment processing is lightning fast. Our customers love the seamless UPI experience.",
    author: "Priya Desai",
    position: "Founder, StyleHouse",
    delay: 0.2
  },
  {
    quote: "Their developer documentation is comprehensive and the PHP examples helped us integrate quickly without any issues.",
    author: "Akash Patel",
    position: "Lead Developer, CloudRetail",
    delay: 0.3
  },
  {
    quote: "We've cut our payment processing costs by 30% since switching to RizzPay. The ROI has been tremendous.",
    author: "Neha Gupta",
    position: "Finance Director, GlobalMart",
    delay: 0.4
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-xs font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Businesses across India trust RizzPay to handle their payment processing needs.
            Here's what they have to say about their experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.delay }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);
