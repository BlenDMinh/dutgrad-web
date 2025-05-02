import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
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

  return (
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
              Join thousands of satisfied users who have revolutionized how they
              work with documents.
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
  );
}
