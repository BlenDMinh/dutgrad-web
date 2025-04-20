"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  FileText,
  MessageSquare,
  Search,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Refs for scroll animations
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerCardVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background relative">
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 2 }}
          className="absolute top-20 right-[20%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute bottom-20 left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"
        />

        <div className="container px-6 md:px-12 lg:px-16 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4"
                >
                  <Sparkles className="mr-1 h-3 w-3" /> Introducing DUTGrad AI
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600"
                >
                  Smart Document Storage Powered by AI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                >
                  Store, organize, and retrieve your documents instantly with
                  our AI-powered chatbot. Ask questions in natural language and
                  get precise answers.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Button size="lg" className="group">
                  Get Started
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="ml-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-lg shadow-2xl overflow-hidden border border-primary/20">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,#000)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-center"
                  >
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-primary">
                      AI-Powered Document Management
                    </h3>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="w-full py-12 md:py-24 bg-background"
        ref={featuresRef}
      >
        <div className="container px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage your documents efficiently
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {[
              {
                icon: <Zap className="h-10 w-10 text-primary mb-2" />,
                title: "AI-Powered Search",
                description:
                  "Find documents instantly with natural language queries",
                content:
                  "Our advanced AI understands context and semantics, delivering precise results even when you don't remember exact file names or content.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-primary mb-2" />,
                title: "Interactive ChatBot",
                description:
                  "Ask questions and get answers from your documents",
                content:
                  "Our ChatBot doesn't just find documents - it extracts relevant information and presents answers in a conversational format.",
              },
              {
                icon: <FileText className="h-10 w-10 text-primary mb-2" />,
                title: "Smart Organization",
                description: "Automatic categorization and tagging",
                content:
                  "Upload documents and let our AI automatically organize them with relevant tags, categories, and metadata for effortless retrieval.",
              },
              {
                icon: <Search className="h-10 w-10 text-primary mb-2" />,
                title: "Content Analysis",
                description: "Extract insights from your document collection",
                content:
                  "Discover patterns, trends, and connections across your documents with our advanced content analysis tools.",
              },
              {
                icon: <Shield className="h-10 w-10 text-primary mb-2" />,
                title: "Secure Storage",
                description:
                  "Enterprise-grade security for your sensitive documents",
                content:
                  "End-to-end encryption, access controls, and compliance features keep your documents safe and secure.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-primary mb-2" />,
                title: "Seamless Integration",
                description: "Works with your existing tools and workflows",
                content:
                  "Integrate with Google Drive, Dropbox, Microsoft Office, Slack, and more to enhance your productivity.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={itemVariants} custom={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card h-full border-t-4 border-primary/40 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="w-full py-12 md:py-24 bg-muted/50"
        ref={howItWorksRef}
      >
        <div className="container px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How DUTGrad Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple, intuitive, and powerful document management
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative">
            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute top-8 left-[20%] right-[20%] h-1 bg-primary/20 hidden md:block"
              style={{ transformOrigin: "left" }}
            />

            {[
              {
                number: "1",
                title: "Upload Documents",
                description:
                  "Drag and drop files or connect to cloud storage to import your documents.",
              },
              {
                number: "2",
                title: "AI Processing",
                description:
                  "Our AI analyzes, indexes, and organizes your documents for optimal retrieval.",
              },
              {
                number: "3",
                title: "Ask Questions",
                description:
                  "Use natural language to query your documents and get instant, accurate answers.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1, backgroundColor: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"
                >
                  <span className="text-2xl font-bold">{step.number}</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ChatBot Demo Section */}
      <section className="w-full py-12 md:py-24 bg-background" ref={chatbotRef}>
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Meet Your Document Assistant
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI chatbot understands your questions and finds exactly
                  what you need from your documents.
                </p>
              </div>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="space-y-2"
              >
                {[
                  "Ask complex questions about your documents",
                  "Get summaries of long documents",
                  "Compare information across multiple files",
                  "Extract specific data points",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button>Try the Demo</Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md bg-card rounded-lg shadow-xl overflow-hidden border border-border">
                <div className="bg-primary p-4 text-primary-foreground">
                  <h3 className="font-medium">DUTGrad Assistant</h3>
                </div>
                <div className="p-4 h-80 bg-muted/50 overflow-y-auto">
                  <div className="flex flex-col space-y-4">
                    {[
                      {
                        isUser: false,
                        text: "Hello! I'm your DUTGrad Assistant. How can I help you with your documents today?",
                      },
                      {
                        isUser: true,
                        text: "Where is the quarterly financial report from Q2 2023?",
                      },
                      {
                        isUser: false,
                        text: "I found the Q2 2023 financial report in your Finance folder. It was uploaded on July 15, 2023. Would you like me to summarize the key points or open the document?",
                      },
                      {
                        isUser: true,
                        text: "Summarize the revenue growth compared to Q1, please.",
                      },
                      {
                        isUser: false,
                        text: "According to the Q2 2023 report, revenue grew by 18.7% compared to Q1 2023, exceeding the projected growth of 15%. The main drivers were the new product line (contributing 7.3%) and expansion into European markets (contributing 6.2%).",
                      },
                    ].map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1 + index * 0.5, duration: 0.5 }}
                        className={`flex items-start ${
                          message.isUser ? "justify-end" : ""
                        }`}
                      >
                        <div
                          className={`${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10"
                          } rounded-lg p-3 max-w-[80%]`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask about your documents..."
                      className="flex-1 px-3 py-2 bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="w-full py-12 md:py-24 bg-muted/50"
        ref={testimonialsRef}
      >
        <div className="container px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by Teams Everywhere
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See what our users have to say about DUTGrad
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: "Sarah Johnson",
                role: "Research Director, Acme Inc.",
                testimonial:
                  "DUTGrad has transformed how our research team manages documentation. The AI assistant saves us hours of searching through papers and reports.",
              },
              {
                name: "Michael Chen",
                role: "Legal Counsel, LexCorp",
                testimonial:
                  "The ability to query across thousands of legal documents and get precise answers has been game-changing for our legal department.",
              },
              {
                name: "Elena Rodriguez",
                role: "CTO, TechStart",
                testimonial:
                  "We've integrated DUTGrad with our knowledge base, and it's dramatically improved how quickly our team can access critical information.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card h-full hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "{testimonial.testimonial}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-background" ref={pricingRef}>
        <div className="container px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works for your needs
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Starter",
                description: "For individuals and small teams",
                price: "$9",
                features: [
                  "Up to 1,000 documents",
                  "Basic AI search",
                  "5 GB storage",
                  "Email support",
                ],
                popular: false,
              },
              {
                title: "Professional",
                description: "For growing businesses",
                price: "$29",
                features: [
                  "Up to 10,000 documents",
                  "Advanced AI search & chatbot",
                  "25 GB storage",
                  "Priority support",
                  "Team collaboration",
                ],
                popular: true,
              },
              {
                title: "Enterprise",
                description: "For large organizations",
                price: "Custom",
                features: [
                  "Unlimited documents",
                  "Custom AI models",
                  "Unlimited storage",
                  "24/7 dedicated support",
                  "Advanced security & compliance",
                  "Custom integrations",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="flex"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col w-full"
                >
                  <Card
                    className={`flex flex-col h-full bg-card ${
                      plan.popular ? "border-primary shadow-lg relative" : ""
                    }`}
                  >
                    {plan.popular && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute -top-3 inset-x-0 mx-auto w-fit py-1 px-3 bg-primary text-primary-foreground text-sm rounded-full"
                      >
                        Most Popular
                      </motion.div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.price !== "Custom" && (
                          <span className="text-muted-foreground">/month</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="space-y-2"
                      >
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            variants={itemVariants}
                            className="flex items-center"
                          >
                            <CheckCircle className="h-5 w-5 text-primary mr-2" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={
                          plan.title === "Enterprise" ? "outline" : "default"
                        }
                      >
                        {plan.title === "Enterprise"
                          ? "Contact Sales"
                          : "Get Started"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
        </motion.div>

        <div className="container px-6 md:px-12 lg:px-16 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Document Management?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied users who have revolutionized how
                they work with documents.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-muted group"
              >
                Start Free Trial
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Button>
              <Button
                size="lg"
                className="border-primary-foreground hover:bg-primary/90"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-muted/80 text-foreground">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">DUTGrad</h3>
              <p className="text-sm text-muted-foreground">
                Smart document storage and retrieval powered by artificial
                intelligence.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground"
          >
            <p>© {new Date().getFullYear()} DUTGrad. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
