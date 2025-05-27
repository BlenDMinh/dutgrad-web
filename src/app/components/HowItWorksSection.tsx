import { motion } from "framer-motion";

export function HowItWorksSection() {
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

  const steps = [
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
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
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
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-8 left-[20%] right-[20%] h-1 bg-primary/20 hidden md:block"
            style={{ transformOrigin: "left" }}
          />

          {steps.map((step, index) => (
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
  );
}
