import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ServerIcon,
  CpuChipIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import {
  Typography,
  Card,
  CardBody,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Navbar,
  IconButton
} from "@material-tailwind/react";
import { ChatBox } from "../components/ChatBox";

// FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

export function LearnMore() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [activeTab, setActiveTab] = useState("etl");

  const handleAccordionOpen = (value: number) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Services data
  const services = [
    {
      id: "etl",
      title: "ETL Solutions",
      icon: ServerIcon,
      description: "Our ETL (Extract, Transform, Load) solutions leverage AI to streamline and optimize your data pipelines, ensuring data quality, consistency, and real-time processing capabilities.",
      features: [
        "Automated data validation and cleansing",
        "Real-time processing with parallel computing",
        "Custom transformation rules based on business logic",
        "Integration with all major data sources and destinations",
        "Comprehensive error handling and monitoring"
      ],
      useCases: [
        "Financial data aggregation and reporting",
        "Healthcare records management and analysis",
        "E-commerce data synchronization",
        "IoT data processing and analytics",
        "Cross-platform data integration"
      ],
      technologies: ["Python", "Apache Airflow", "Spark", "Kafka", "TensorFlow", "PostgreSQL", "Elasticsearch"]
    },
    {
      id: "knowledge",
      title: "Knowledge Graphs",
      icon: CpuChipIcon,
      description: "Our Knowledge Graph solutions create dynamic, interconnected data networks that reveal hidden patterns and relationships, enabling more intelligent decision-making and data exploration.",
      features: [
        "Entity relationship mapping and visualization",
        "Semantic analysis and natural language processing",
        "Automated ontology construction",
        "Complex query processing and optimization",
        "Integration with existing databases and systems"
      ],
      useCases: [
        "Customer relationship insights",
        "Drug discovery and biomedical research",
        "Financial fraud detection networks",
        "Supply chain optimization",
        "Recommendation systems"
      ],
      technologies: ["Neo4j", "GraphQL", "RDF", "SPARQL", "Python", "D3.js", "Natural Language Processing"]
    },
    {
      id: "llm",
      title: "Custom LLM Training",
      icon: LightBulbIcon,
      description: "We specialize in training and fine-tuning large language models for your specific industry and use cases, creating AI systems that understand your domain-specific terminology and requirements.",
      features: [
        "Domain adaptation for specialized industries",
        "Fine-tuning on proprietary data",
        "Performance optimization for production environments",
        "Continuous learning and improvement cycles",
        "Explainable AI implementation"
      ],
      useCases: [
        "Legal document analysis and contract review",
        "Medical research and literature analysis",
        "Customer support automation",
        "Technical documentation generation",
        "Specialized content creation"
      ],
      technologies: ["PyTorch", "TensorFlow", "Hugging Face Transformers", "ONNX", "Python", "CUDA", "Ray"]
    }
  ];

  // Process steps
  const processSteps = [
    {
      title: "Discovery",
      description: "We begin with a comprehensive analysis of your business needs, existing systems, and data landscape to identify opportunities for AI integration."
    },
    {
      title: "Solution Design",
      description: "Our experts design a tailored solution architecture that addresses your specific challenges and aligns with your business objectives."
    },
    {
      title: "Development",
      description: "Using agile methodologies, we develop and iteratively refine your custom AI solution, ensuring it meets the highest standards of quality and performance."
    },
    {
      title: "Integration",
      description: "We seamlessly integrate the solution with your existing systems, ensuring minimal disruption to your operations."
    },
    {
      title: "Training & Handover",
      description: "Your team receives comprehensive training on the new systems, along with detailed documentation for future reference."
    },
    {
      title: "Ongoing Support",
      description: "We provide continuous monitoring, optimization, and support to ensure your solution evolves with your business needs."
    }
  ];

  // Benefits data
  const benefits = [
    {
      icon: ChartBarIcon,
      title: "Increased Efficiency",
      description: "Automate repetitive tasks and streamline workflows to reduce manual effort and increase productivity."
    },
    {
      icon: ShieldCheckIcon,
      title: "Enhanced Decision Making",
      description: "Gain deeper insights from your data to make more informed business decisions with confidence."
    },
    {
      icon: BoltIcon,
      title: "Accelerated Innovation",
      description: "Rapidly develop and deploy new capabilities to stay ahead of market trends and competition."
    },
    {
      icon: UserGroupIcon,
      title: "Improved Customer Experience",
      description: "Deliver personalized interactions and faster service response times to increase customer satisfaction."
    }
  ];

  // FAQs data
  const faqs: FAQ[] = [
    {
      question: "What makes Theoforge different from other AI solution providers?",
      answer: "Theoforge combines deep technical expertise with industry-specific knowledge to deliver truly customized AI solutions. We focus on practical business outcomes rather than theoretical applications, ensuring measurable ROI from your AI investments. Our end-to-end approach covers everything from initial strategy to implementation and ongoing support."
    },
    {
      question: "How long does it typically take to implement an AI solution?",
      answer: "Implementation timelines vary based on the complexity of the solution and the state of your existing systems. Simple ETL solutions might be deployed in 4-6 weeks, while comprehensive knowledge graphs or custom LLM training could take 3-6 months. During our initial discovery phase, we'll provide a detailed timeline specific to your project."
    },
    {
      question: "Do I need to have existing AI infrastructure to work with Theoforge?",
      answer: "No, we can work with organizations at any stage of their AI journey. Whether you're starting from scratch or looking to enhance existing capabilities, our solutions can be tailored to your current infrastructure and future goals. We can deploy on-premises, in the cloud, or in hybrid environments based on your requirements."
    },
    {
      question: "How do you ensure the security and privacy of our data?",
      answer: "Security and privacy are paramount in all our implementations. We follow industry best practices for data protection, including encryption, access controls, and regular security audits. All our solutions comply with relevant regulations like GDPR, HIPAA, and CCPA. We're happy to work with your security team to ensure our solutions meet your specific requirements."
    },
    {
      question: "What kind of support do you provide after implementation?",
      answer: "We offer comprehensive post-implementation support, including monitoring, optimization, and troubleshooting. Our standard support packages include regular maintenance, performance reviews, and access to our technical team. We also provide training for your staff and detailed documentation to ensure your team can effectively manage the solution."
    },
    {
      question: "Can your solutions integrate with our existing systems and software?",
      answer: "Yes, our solutions are designed with integration in mind. We have experience working with a wide range of databases, CRM systems, ERP solutions, and custom software. During the discovery phase, we'll assess your current technology stack and design integrations that minimize disruption while maximizing value."
    }
  ];

  // Custom styles for accordion
  function Icon({ id, open }: { id: number, open: number }) {
    return (
      <div className="relative h-5 w-5">
        {id === open ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              color="teal"
              className="flex items-center gap-2"
              onClick={handleBackToDashboard}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              color="teal"
              className="flex items-center gap-2"
              onClick={() => setIsChatOpen(true)}
            >
              <SparklesIcon className="h-5 w-5" />
              Get a Consultation
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Advanced AI Solutions</span>
            </div>
            <Typography variant="h1" className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Transforming Business with<br />
              <span className="text-teal-600">Intelligent AI Solutions</span>
            </Typography>
            <Typography variant="lead" color="blue-gray" className="mt-6 max-w-3xl mx-auto text-xl">
              At Theoforge, we develop cutting-edge AI solutions that solve real business challenges, 
              drive innovation, and create lasting competitive advantages for our clients.
            </Typography>
            <div className="mt-10">
              <Button
                size="lg"
                className="flex items-center gap-3 mx-auto"
                color="teal"
                onClick={() => setIsChatOpen(true)}
              >
                <SparklesIcon className="h-5 w-5" /> Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Tabs Section */}
      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Typography variant="h2" className="mb-4">Our Specialized Solutions</Typography>
          <Typography variant="paragraph" color="blue-gray" className="max-w-3xl mx-auto">
            Discover how our advanced AI technologies can transform your business operations, 
            enhance decision-making, and drive sustainable growth.
          </Typography>
        </div>

        <Tabs value={activeTab} className="mt-12">
          <TabsHeader className="bg-gray-100 rounded-lg p-2">
            {services.map(({ id, title }) => (
              <Tab key={id} value={id} onClick={() => setActiveTab(id)}>
                {title}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {services.map(({ id, title, icon: Icon, description, features, useCases, technologies }) => (
              <TabPanel key={id} value={id} className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="mb-4 flex items-center">
                      <Icon className="h-8 w-8 text-teal-600 mr-3" />
                      <Typography variant="h3">{title}</Typography>
                    </div>
                    <Typography color="blue-gray" className="mb-6">
                      {description}
                    </Typography>
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                      <Typography variant="h6" className="mb-4">Technologies</Typography>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <span key={tech} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardBody>
                        <Typography variant="h5" color="teal" className="mb-4">
                          Key Features
                        </Typography>
                        <ul className="space-y-3">
                          {features.map((feature, index) => (
                            <li key={index} className="flex">
                              <ChevronRightIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                              <Typography variant="paragraph">{feature}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Typography variant="h5" color="teal" className="mb-4">
                          Use Cases
                        </Typography>
                        <ul className="space-y-3">
                          {useCases.map((useCase, index) => (
                            <li key={index} className="flex">
                              <ChevronRightIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                              <Typography variant="paragraph">{useCase}</Typography>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">Our Proven Process</Typography>
            <Typography variant="paragraph" color="blue-gray" className="max-w-3xl mx-auto">
              We follow a structured, collaborative approach to ensure your AI solution delivers maximum value and integrates seamlessly with your business.
            </Typography>
          </div>

          <div className="relative">
            {/* Process timeline */}
            <div className="hidden md:block absolute left-1/2 h-full w-1 bg-teal-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 relative">
              {processSteps.map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <Typography variant="h4" color="teal" className="mb-3">
                        {index + 1}. {step.title}
                      </Typography>
                      <Typography color="blue-gray">
                        {step.description}
                      </Typography>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-teal-500 text-white text-xl font-bold z-10 my-4 md:my-0">
                    {index + 1}
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">The Theoforge Advantage</Typography>
          <Typography variant="paragraph" color="blue-gray" className="max-w-3xl mx-auto">
            Our solutions deliver tangible business benefits that drive growth, efficiency, and innovation.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardBody className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-teal-50 p-4">
                  <benefit.icon className="h-8 w-8 text-teal-600" />
                </div>
                <Typography variant="h5" className="mb-3">
                  {benefit.title}
                </Typography>
                <Typography color="blue-gray">
                  {benefit.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">Frequently Asked Questions</Typography>
            <Typography variant="paragraph" color="blue-gray" className="max-w-3xl mx-auto">
              Find answers to common questions about our AI solutions and services.
            </Typography>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                open={openAccordion === index + 1}
                icon={<Icon id={index + 1} open={openAccordion} />}
              >
                <AccordionHeader onClick={() => handleAccordionOpen(index + 1)} className="text-left">
                  {faq.question}
                </AccordionHeader>
                <AccordionBody>
                  <Typography color="blue-gray">
                    {faq.answer}
                  </Typography>
                </AccordionBody>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h3" color="white" className="mb-6">
            Ready to Transform Your Business with AI?
          </Typography>
          <Typography color="white" className="mb-8 max-w-3xl mx-auto opacity-90">
            Let's discuss how our AI solutions can address your specific challenges and drive your business forward.
          </Typography>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="flex items-center gap-2"
              color="white"
              variant="outlined"
              onClick={() => setIsChatOpen(true)}
            >
              Schedule Consultation
            </Button>
            <Link to="/register">
              <Button
                size="lg"
                className="flex items-center gap-2"
                color="white"
              >
                Get Started <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="rounded-full p-4 shadow-lg"
          color="teal"
          onClick={handleBackToDashboard}
        >
          <HomeIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default LearnMore;