
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from '@/components/ui/motion';

const IntegrationsSection = () => {
  const technologies = [
    { name: "PHP", color: "#8892BF" },
    { name: "WordPress", color: "#21759b" },
    { name: "Shopify", color: "#7AB55C" },
    { name: "Magento", color: "#F26322" },
    { name: "WooCommerce", color: "#96588A" },
    { name: "Laravel", color: "#FF2D20" },
    { name: "React", color: "#61DAFB" },
    { name: "Node.js", color: "#339933" }
  ];

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-xs font-medium">Seamless Integrations</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Works With Your Tech Stack</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            RizzPay integrates with all popular technologies and platforms.
            Our flexible API and SDKs make implementation simple across any stack.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${tech.color}20` }}
                  >
                    <span className="font-bold" style={{ color: tech.color }}>{tech.name.charAt(0)}</span>
                  </div>
                  <p className="font-medium">{tech.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 max-w-3xl mx-auto p-6 bg-primary/5 rounded-lg border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-medium mb-4 text-center">Custom Integration</h3>
          <p className="text-muted-foreground text-center mb-6">
            Don't see your platform? Our team can help you build a custom integration tailored to your specific needs.
          </p>
          <div className="text-center">
            <a 
              href="mailto:support@rizzpay.com" 
              className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              Contact for Custom Integration
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(IntegrationsSection);
