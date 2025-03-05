import React, { useState, useEffect } from 'react';
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
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { ChatBox } from './components/ChatBox';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Collapse,
  Chip
} from "@material-tailwind/react";
import axios from 'axios';
type Role = 'none' | 'guest' | 'user' | 'admin';
export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  role: Role;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, passsword: string) => Promise<number>;
  logout: () => void;
}>({
  isAuthenticated: false,
  role: 'none',
  login: async () => false,
  register: async () => 500,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('none' as Role);

  const login = async (email: string, password: string) => {
    if (email === 'guest' && password === 'guest') {
      try {
        await axios.post('http://localhost:8000/guests', {
          // Params will be updated once backend team finishes
          "additional_notes": "Looking for a long-term partnership",
          "budget": "$10,000 - $20,000",
          "company": "Tech Solutions",
          "contact_info": "john.doe@example.com",
          "current_tech": [
            "React",
            "Node.js"
          ],
          "industry": "Software",
          "interaction_events": [
            "clicked_contact_form"
          ],
          "interaction_history": [
            {
              "event": "filled_contact_form",
              "timestamp": "2025-03-01T15:30:00Z"
            }
          ],
          "name": "John Doe",
          "page_views": [
            "/home",
            "/contact"
          ],
          "pain_points": [
            "Scalability issues",
            "Need for automation"
          ],
          "project_type": [
            "Web Development"
          ],
          "session_id": "session_test123",
          "status": "NEW",
          "timeline": "Q2 2025"
        });
        setRole('guest');
        setIsAuthenticated(true);
        return true;
      } catch {
        return false;
      }
    }
    else {
      try {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        await axios.post('http://localhost:8000/auth/login', params);
        setRole('user');
        setIsAuthenticated(true);
        return true;
      } catch {
        return false;
      }
    }
  };

  const register = async (email: string, password: string) => {
    let response = 500;
    await axios.post('http://localhost:8000/auth/register', {
      "email": email,
      "first_name": 'John',
      "last_name": 'Doe',
      "nickname": 'johndoe2',
      "password": password,
    }).then(() => {
      setRole('user');
      setIsAuthenticated(true);
      response = 200;
    }).catch(err => {
      if (err.response.data.detail === '400: Email already exists') {
        response = 400;
      } else if (err.response.data.detail === 'Not Found') {
        response = 404;
      } else {
        response = 500;
      }
    })
    return response;
  };

  const logout = () => {
    // TODO: if role is guest, remove the guest by session id(currently session id is not unique)
    setIsAuthenticated(false);
    setRole('none');
    console.log("logout");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, register, logout }}>
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

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

  const testimonials = [
    {
      quote: "Theoforge's ETL solutions transformed our data pipeline, reducing processing time by 75% and improving data quality significantly.",
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechNova Solutions",
      avatar: "/api/placeholder/80/80"
    },
    {
      quote: "The knowledge graph implementation helped us discover critical relationships in our data that were previously invisible. Game-changing for our research team.",
      name: "Dr. Michael Chen",
      role: "Director of Research",
      company: "HealthScan Inc.",
      avatar: "/api/placeholder/80/80"
    },
    {
      quote: "Their custom LLM training created a model that actually understands our industry terminology. Customer service efficiency improved by 40%.",
      name: "Alex Rivera",
      role: "VP of Operations",
      company: "Globex Financial",
      avatar: "/api/placeholder/80/80"
    },
    {
      quote: "Working with Theoforge was seamless. Their team understood our needs and delivered solutions that exceeded our expectations on every level.",
      name: "Priya Patel",
      role: "Head of Innovation",
      company: "FutureTech Industries",
      avatar: "/api/placeholder/80/80"
    }
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
      {/* Sticky Header */}
      <Navbar className="sticky top-0 z-10 mx-auto max-w-screen-xl px-4 py-2 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
            <Typography
              variant="h3"
              className="ml-2 cursor-pointer font-bold hidden sm:block"
            >
              Theoforge
            </Typography>
          </Link>
          <div className="hidden lg:block">
            <div className="flex items-center gap-6">
              <Link to="#services" className="text-gray-700 hover:text-teal-500 transition-colors">
                Services
              </Link>
              <Link to="#testimonials" className="text-gray-700 hover:text-teal-500 transition-colors">
                Testimonials
              </Link>
              <Link to="#contact" className="text-gray-700 hover:text-teal-500 transition-colors">
                Contact
              </Link>
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </IconButton>
        </div>
        <Collapse open={isMenuOpen} className="lg:hidden">
          <div className="mt-4 mb-2 flex flex-col gap-4">
            <Link to="#services" className="block py-2 text-gray-700 hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link to="#testimonials" className="block py-2 text-gray-700 hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </Link>
            <Link to="#contact" className="block py-2 text-gray-700 hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="text" color="blue-gray" fullWidth>Sign in</Button>
              </Link>
              <Link to="/register" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="gradient" color="teal" fullWidth>Get Started</Button>
              </Link>
            </div>
          </div>
        </Collapse>
      </Navbar>

      <div className="flex-grow">
        <div className="relative">
          {/* Hero Section */}
          <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 animate-pulse">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Powered by Advanced AI</span>
                </div>
              </div>
              <Typography variant="h1" className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                Transform Your Business
                <br />
                <span className="text-primary-600 relative">
                  With Advanced AI Solutions
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-teal-500 rounded-full transform scale-x-0 transition-transform duration-500 ease-out" style={{ transform: isVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
                </span>
              </Typography>
              <Typography variant="lead" color="blue-gray" className="mt-3 max-w-2xl mx-auto text-xl">
                Unlock the full potential of AI technology with Theoforge. We specialize in custom AI solutions, from ETL and Knowledge Graphs to LLM training, helping businesses innovate and scale.
              </Typography>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="flex items-center gap-3"
                  color="teal"
                  onClick={() => setIsChatOpen(true)}>
                  <SparklesIcon className="h-5 w-5" /> Discuss Your Project
                </Button>
                <Button
                  size="lg"
                  variant="outlined"
                  color="teal"
                  className="flex items-center gap-2">
                  Learn More <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Features List */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-all duration-300">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="hidden sm:block absolute top-1/4 right-10 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
            <div className="hidden sm:block absolute bottom-1/4 left-10 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Services Section */}
          <div id="services" className="bg-white py-20 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="flex justify-center">
                  <div className="inline-flex items-center">
                    <div className="h-px w-12 bg-teal-500 mr-4"></div>
                    <Typography variant="lead" color="teal" className="uppercase tracking-wider font-semibold text-sm">
                      Our Services
                    </Typography>
                    <div className="h-px w-12 bg-teal-500 ml-4"></div>
                  </div>
                </div>
                <Typography variant="h2" className="text-5xl font-bold mt-4 mb-4">Transformative AI Expertise</Typography>
                <Typography variant="paragraph" color="blue-gray" className="max-w-2xl mx-auto">
                  Comprehensive AI solutions tailored to your business needs, powered by cutting-edge technology and industry expertise.
                </Typography>
              </div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {services.map((service, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-visible pt-12 relative">
                    {/* Circle icon properly positioned */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center shadow-md">
                        {index === 0 ? (
                          <SparklesIcon className="h-10 w-10 text-white" />
                        ) : index === 1 ? (
                          <GlobeAltIcon className="h-10 w-10 text-white" />
                        ) : (
                          <BeakerIcon className="h-10 w-10 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6">
                      {/* Title and subtitle */}
                      <div className="text-center mb-4">
                        <Typography variant="h4" className="text-xl font-bold">
                          {service.title}
                        </Typography>
                        <Typography variant="paragraph" className="text-teal-500">
                          {service.subtitle}
                        </Typography>
                        <div className="w-16 h-1 bg-teal-200 mx-auto my-3"></div>
                      </div>
                      
                      {/* Description */}
                      <Typography className="text-center mb-6">
                        {service.description}
                      </Typography>
                      
                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 text-teal-500">
                              <CheckCircleIcon className="h-5 w-5" />
                            </div>
                            <Typography variant="small">{feature}</Typography>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Explore link */}
                      <div className="text-center">
                        <Link to="#" className="text-teal-500 font-medium uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:text-teal-600 transition-colors">
                          Explore {service.title === "ETL Solutions" ? "ETL solutions" : 
                                   service.title === "Knowledge Graphs" ? "Knowledge Graphs" : 
                                   "Custom LLM Training"}
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Testimonials Section */}
          <div id="testimonials" className="py-20 sm:py-28 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-50 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-50 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-teal-500"></div>
                  <Typography variant="lead" color="teal" className="mx-4 uppercase tracking-wider font-semibold text-sm">
                    Client Success Stories
                  </Typography>
                  <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-teal-500"></div>
                </div>
                <Typography variant="h2" className="text-4xl font-bold mb-4">Trusted by Industry Leaders</Typography>
                <Typography variant="paragraph" color="blue-gray" className="max-w-2xl mx-auto">
                  Don't just take our word for it. See how our AI solutions have transformed businesses across industries.
                </Typography>
              </div>
              
              {/* Desktop Testimonials - Completely redesigned */}
              <div className="hidden md:block">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-5">
                    <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg border border-gray-100">
                      <div className="flex justify-center mb-8">
                        <div className="h-16 w-16 rounded-full bg-teal-50 flex items-center justify-center">
                          <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-teal-500" />
                        </div>
                      </div>
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <Typography variant="h3" className="text-center text-xl mb-6">
                        Our clients achieve remarkable results
                      </Typography>
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <Chip size="sm" value="Data Solutions" color="teal" variant="outlined" />
                        <Chip size="sm" value="AI Integration" color="blue-gray" variant="outlined" />
                        <Chip size="sm" value="Enterprise" color="teal" variant="outlined" />
                        <Chip size="sm" value="Healthcare" color="blue-gray" variant="outlined" />
                        <Chip size="sm" value="Finance" color="teal" variant="outlined" />
                      </div>
                      <Button 
                        color="teal" 
                        className="w-full flex items-center justify-center gap-2"
                      >
                        Read All Success Stories <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-7 space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="group">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 group-hover:shadow-lg group-hover:border-teal-100 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              <Avatar src={testimonial.avatar} alt={testimonial.name} size="lg" className="ring-4 ring-teal-50" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <Typography variant="h6">{testimonial.name}</Typography>
                                  <Typography variant="small" color="gray" className="flex items-center gap-1">
                                    {testimonial.role}, <span className="font-semibold text-teal-700">{testimonial.company}</span>
                                  </Typography>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-7 top-0 text-6xl text-teal-200 opacity-50 font-serif">"</div>
                                <Typography variant="paragraph" className="relative z-10">
                                  {testimonial.quote}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mobile Testimonials - Enhanced carousel */}
              <div className="md:hidden relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full py-1 px-3 flex items-center gap-1 shadow-sm">
                    <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <Typography className="text-xs font-medium">5.0 Rating</Typography>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-full py-1 px-3 flex items-center gap-1 shadow-sm">
                    <ChatBubbleBottomCenterTextIcon className="h-3 w-3 text-teal-500" />
                    <Typography className="text-xs font-medium">{testimonials.length} Stories</Typography>
                  </div>
                </div>
                
                <div className="overflow-hidden bg-gray-50">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="w-full flex-shrink-0 p-6 pt-16">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-center -mt-12 mb-4">
                            <Avatar 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              size="xl" 
                              className="ring-4 ring-white shadow-md" 
                            />
                          </div>
                          <div className="text-center mb-3">
                            <Typography variant="h6">{testimonial.name}</Typography>
                            <Typography variant="small" color="teal" className="font-medium">
                              {testimonial.company}
                            </Typography>
                          </div>
                          <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                          <Typography variant="paragraph" className="italic text-center">
                            "{testimonial.quote}"
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Enhanced Carousel Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-1">
                  <button 
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm text-gray-700 hover:text-teal-500 transition-colors" 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`inline-block w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                          activeTestimonial === index ? 'bg-teal-500 w-4' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm text-gray-700 hover:text-teal-500 transition-colors" 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "500+", label: "Projects Delivered" },
                  { value: "98%", label: "Client Satisfaction" },
                  { value: "24/7", label: "Expert Support" },
                  { value: "50+", label: "Industry Partners" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative inline-block">
                      <Typography variant="h3" color="teal" className="text-3xl md:text-4xl lg:text-5xl font-bold group-hover:scale-110 transition-transform">
                        {stat.value}
                      </Typography>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <Typography color="blue-gray" className="mt-2">
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact CTA Section */}
          <div id="contact" className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Typography variant="h3" className="mb-4">Ready to Transform Your Business?</Typography>
              <Typography variant="paragraph" className="mb-8 opacity-90">
                Contact us today to discuss how our AI solutions can help you achieve your business goals.
              </Typography>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  color="teal" 
                  size="lg"
                  className="flex items-center justify-center gap-2"
                  onClick={() => setIsChatOpen(true)}
                >
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5" /> Start a Conversation
                </Button>
                <Button 
                  variant="outlined" 
                  color="white"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" /> Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Upper Footer */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Typography variant="h6" className="text-white mb-4">Solutions</Typography>
              <ul className="space-y-3">
                {footerNavigation.solutions.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                      <ArrowRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
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
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                      <ArrowRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
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
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                      <ArrowRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant="h6" className="text-white mb-4">Contact</Typography>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <EnvelopeIcon className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>contact@theoforge.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <PhoneIcon className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <MapPinIcon className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>Newark, NJ</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                  <GlobeAltIcon className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>Global Operations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lower Footer */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
                <Typography variant="h5" className="text-white">
                  Theoforge
                </Typography>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
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