
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  CheckCircle, 
  AlertTriangle,
  Fingerprint,
  Globe,
  Clock,
  Award
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "PCI DSS Level 1 Compliance",
      description: "Highest level of payment card industry compliance",
      details: "Annual security assessments and continuous monitoring"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "256-bit SSL encryption for all data transmission",
      details: "Data encrypted at rest and in transit"
    },
    {
      icon: Fingerprint,
      title: "Advanced Authentication",
      description: "Multi-factor authentication and biometric security",
      details: "OAuth 2.0, API keys, and device fingerprinting"
    },
    {
      icon: Eye,
      title: "Fraud Detection",
      description: "AI-powered real-time fraud monitoring",
      details: "Machine learning algorithms detect suspicious patterns"
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud security",
      details: "Isolated environments and network segmentation"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Compliant with international security standards",
      details: "GDPR, SOX, ISO 27001, and local regulations"
    }
  ];

  const certifications = [
    { name: "PCI DSS Level 1", status: "Certified", icon: Award },
    { name: "ISO 27001", status: "Certified", icon: Award },
    { name: "SOC 2 Type II", status: "Certified", icon: Award },
    { name: "GDPR", status: "Compliant", icon: CheckCircle }
  ];

  const securityMetrics = [
    { label: "Uptime", value: "99.99%", description: "System availability" },
    { label: "Response Time", value: "<50ms", description: "Security validation" },
    { label: "Fraud Detection", value: "99.8%", description: "Accuracy rate" },
    { label: "Encryption", value: "256-bit", description: "AES encryption" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Security & Compliance | RizzPay</title>
        <meta name="description" content="Learn about RizzPay's comprehensive security measures and compliance certifications." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Shield className="h-4 w-4 mr-1" />
            Security First
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data and transactions are protected by industry-leading security measures and compliance standards
          </p>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{feature.details}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Metrics */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Security Performance</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Real-time security metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                {securityMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold mb-2">{metric.value}</div>
                    <div className="text-lg font-medium mb-1">{metric.label}</div>
                    <div className="text-blue-100 text-sm">{metric.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{cert.name}</h3>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {cert.status}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Security Practices</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Continuous Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">24/7 security operations center (SOC)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Real-time threat detection and response</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Automated vulnerability scanning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Regular security assessments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Dedicated incident response team</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Automated threat containment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Forensic analysis and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Post-incident remediation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Timeline */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Security Timeline</CardTitle>
              <CardDescription className="text-center">
                Our commitment to maintaining the highest security standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Daily Security Scans</h4>
                    <p className="text-sm text-gray-600">Automated vulnerability assessments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Weekly Penetration Testing</h4>
                    <p className="text-sm text-gray-600">Third-party security testing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Monthly Security Reviews</h4>
                    <p className="text-sm text-gray-600">Comprehensive security audits</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Annual Compliance Audits</h4>
                    <p className="text-sm text-gray-600">Independent security certifications</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Trust & Security</h3>
              <p className="text-gray-600 mb-6">
                Learn more about our security practices and how we protect your business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Security Documentation
                </Button>
                <Button size="lg" variant="outline">
                  Contact Security Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;
