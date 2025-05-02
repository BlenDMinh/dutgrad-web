import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function ChatbotSection() {
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

  return (
    <section className="w-full py-12 md:py-24 bg-background">
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
                Our AI chatbot understands your questions and finds exactly what
                you need from your documents.
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
                      animate={{ opacity: 1, y: 0 }}
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
  );
}
