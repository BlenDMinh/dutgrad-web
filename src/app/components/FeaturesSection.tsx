import {
  Card,
  CardContent,
  CardDescription,
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
} from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
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

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary mb-2" />,
      title: "AI-Powered Search",
      description: "Find documents instantly with natural language queries",
      content:
        "Our advanced AI understands context and semantics, delivering precise results even when you don't remember exact file names or content.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary mb-2" />,
      title: "Interactive ChatBot",
      description: "Ask questions and get answers from your documents",
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
      description: "Enterprise-grade security for your sensitive documents",
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
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-background">
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
          {features.map((feature, index) => (
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
  );
}
