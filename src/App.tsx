import React, { useState } from 'react';
import { AdminView } from '/components/AdminView';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  BeakerIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { ChatBox } from './components/ChatBox';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Card,
  CardBody,
  CardHeader
} from "@material-tailwind/react";
import { cn } from './lib/utils';

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string) => {
    if (email === 'test@test.com' && password === 'test123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      title: 'ETL Solutions',
      subtitle: 'Intelligent Data Pipeline Management',
      description: 'Automate and optimize your data workflows with AI-powered ETL pipelines that ensure data quality and consistency.',
      features: [
        'Automated data validation',
        'Real-time processing',
        'Custom data transformations',
        'Error handling & monitoring'
      ]
    },
    {
      title: 'Knowledge Graphs',
      subtitle: 'Intelligent Data Networks',
      description: 'Build dynamic knowledge networks that reveal hidden patterns and relationships in your data for better decision-making.',
      features: [
        'Entity relationship mapping',
        'Semantic analysis',
        'Interactive visualization',
        'Query optimization'
      ]
    },
    {
      title: 'Custom LLM Training',
      subtitle: 'Specialized AI Models',
      description: 'Train language models that understand your industry-specific needs and terminology for enhanced AI capabilities.',
      features: [
        'Domain adaptation',
        'Fine-tuning capabilities',
        'Performance optimization',
        'Continuous learning'
      ]
    },
  ];

  const features = [
    'Advanced AI Integration',
    'Real-time Data Processing',
    'Scalable Architecture',
    'Enterprise Security',
    'Custom Model Training',
    '24/7 Expert Support'
  ];

  const footerNavigation = {
    solutions: [
      { name: 'ETL Solutions', href: '#' },
      { name: 'Knowledge Graphs', href: '#' },
      { name: 'Custom LLM Training', href: '#' },
      { name: 'AI Consulting', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'White Papers', href: '#' },
      { name: 'API Reference', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar className="mx-auto max-w-screen-xl px-4 py-2">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link to="/" className="flex items-center">
            {/* <BeakerIcon className="h-8 w-8 text-primary-600" /> */}
            <img src="/logo.png" alt="Theoforge Logo" className="h-16 w-16" />
            <Typography
              variant="h3"
              className="ml-2 cursor-pointer font-bold"
            >
              Theoforge
            </Typography>
          </Link>
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="text" color="blue-gray">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient" color="teal">Get Started</Button>
              </Link>
            </div>
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </IconButton>
        </div>
      </Navbar>

      <div className="flex-grow">
        <div className="relative">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Powered by Advanced AI</span>
                </div>
              </div>
              <Typography variant="h1" className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                Transform Your Business
                <br />
                <span className="text-primary-600">With Advanced AI Solutions</span>
              </Typography>
              <Typography variant="lead" color="blue-gray" className="mt-3 max-w-2xl mx-auto text-xl">
                Unlock the full potential of AI technology with Theoforge. We specialize in custom AI solutions, from ETL and Knowledge Graphs to LLM training, helping businesses innovate and scale.
              </Typography>
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  size="lg"
                  className="flex items-center gap-3"
                  color="teal"
                  onClick={() => setIsChatOpen(true)}
                >
                  <SparklesIcon className="h-5 w-5" /> Discuss Your Project
                </Button>
                <Button
                  size="lg"
                  variant="outlined"
                  color="teal"
                  className="flex items-center gap-2"
                >
                  Learn More <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Features List */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Typography variant="h2" className="mb-4">Our Expertise</Typography>
                <Typography variant="paragraph" color="blue-gray" className="max-w-2xl mx-auto">
                  Comprehensive AI solutions tailored to your business needs, powered by cutting-edge technology and industry expertise.
                </Typography>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader color="teal" className="relative h-16 flex items-center justify-center">
                      <Typography variant="h3" color="white" className="text-2xl font-bold">
                        {service.title}
                      </Typography>
                    </CardHeader>
                    <CardBody>
                      <Typography variant="h3" className="text-gray-600 text-sm">
                        {service.subtitle}
                      </Typography>
                      <Typography className="mb-4">
                        {service.description}
                      </Typography>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircleIcon className="h-4 w-4 text-primary-600" />
                            <Typography variant="small">{feature}</Typography>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <Typography variant="h3" color="teal">500+</Typography>
                  <Typography color="blue-gray">Projects Delivered</Typography>
                </div>
                <div>
                  <Typography variant="h3" color="teal">98%</Typography>
                  <Typography color="blue-gray">Client Satisfaction</Typography>
                </div>
                <div>
                  <Typography variant="h3" color="teal">24/7</Typography>
                  <Typography color="blue-gray">Expert Support</Typography>
                </div>
                <div>
                  <Typography variant="h3" color="teal">50+</Typography>
                  <Typography color="blue-gray">Industry Partners</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Upper Footer */}
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Typography variant="h6" className="text-white mb-4">Solutions</Typography>
              <ul className="space-y-3">
                {footerNavigation.solutions.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="text-white mb-4">Company</Typography>
              <ul className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="text-white mb-4">Resources</Typography>
              <ul className="space-y-3">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="text-white mb-4">Contact</Typography>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>contact@theoforge.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <PhoneIcon className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPinIcon className="h-5 w-5" />
                  <span>Newark, NJ</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>Global Operations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lower Footer */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                {/* <BeakerIcon className="h-8 w-8 text-primary-500" /> */}
                <img src="/logo.png" alt="Theoforge Logo" className="h-16 w-16" />
                <Typography variant="h5" className="text-white">
                  Theoforge
                </Typography>
              </div>
              <div className="flex gap-6">
                {footerNavigation.legal.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <Typography className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Theoforge. All rights reserved.
              </Typography>
            </div>
          </div>
        </div>
      </footer>

      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;