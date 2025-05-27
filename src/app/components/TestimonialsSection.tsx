import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function TestimonialsSection() {
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

  const testimonials = [
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
              Trusted by Teams Everywhere
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our users have to say about DUTGrad
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
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
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
