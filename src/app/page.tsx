import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, MessageSquare, Search, Shield, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Smart Document Storage Powered by AI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Store, organize, and retrieve your documents instantly with our AI-powered chatbot. Ask questions in
                  natural language and get precise answers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Get Started</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              {/* <img
                src="/placeholder.svg?height=400&width=500"
                alt="DUTGrad Dashboard"
                className="rounded-lg shadow-xl"
                width={500}
                height={400}
              /> */}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage your documents efficiently
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card className="bg-card">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Search</CardTitle>
                <CardDescription>Find documents instantly with natural language queries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {
                    "Our advanced AI understands context and semantics, delivering precise results even when you don't remember exact file names or content."
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Interactive ChatBot</CardTitle>
                <CardDescription>Ask questions and get answers from your documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {
                    "Our ChatBot doesn't just find documents - it extracts relevant information and presents answers in a conversational format."
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>Automatic categorization and tagging</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload documents and let our AI automatically organize them with relevant tags, categories, and
                  metadata for effortless retrieval.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Content Analysis</CardTitle>
                <CardDescription>Extract insights from your document collection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover patterns, trends, and connections across your documents with our advanced content analysis
                  tools.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure Storage</CardTitle>
                <CardDescription>Enterprise-grade security for your sensitive documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end encryption, access controls, and compliance features keep your documents safe and secure.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Seamless Integration</CardTitle>
                <CardDescription>Works with your existing tools and workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrate with Google Drive, Dropbox, Microsoft Office, Slack, and more to enhance your productivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How DUTGrad Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple, intuitive, and powerful document management
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
              <p className="text-muted-foreground">
                Drag and drop files or connect to cloud storage to import your documents.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI analyzes, indexes, and organizes your documents for optimal retrieval.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Ask Questions</h3>
              <p className="text-muted-foreground">
                Use natural language to query your documents and get instant, accurate answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ChatBot Demo Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Meet Your Document Assistant
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI chatbot understands your questions and finds exactly what you need from your documents.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Ask complex questions about your documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Get summaries of long documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Compare information across multiple files</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Extract specific data points</span>
                </li>
              </ul>
              <div>
                <Button>Try the Demo</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-card rounded-lg shadow-xl overflow-hidden border border-border">
                <div className="bg-primary p-4 text-primary-foreground">
                  <h3 className="font-medium">DUTGrad Assistant</h3>
                </div>
                <div className="p-4 h-80 bg-muted/50 overflow-y-auto">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          {" Hello! I'm your DUTGrad Assistant. How can I help you with your documents today?"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Where is the quarterly financial report from Q2 2023?</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          I found the Q2 2023 financial report in your Finance folder. It was uploaded on July 15, 2023.
                          Would you like me to summarize the key points or open the document?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Summarize the revenue growth compared to Q1, please.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          According to the Q2 2023 report, revenue grew by 18.7% compared to Q1 2023, exceeding the
                          projected growth of 15%. The main drivers were the new product line (contributing 7.3%) and
                          expansion into European markets (contributing 6.2%).
                        </p>
                      </div>
                    </div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by Teams Everywhere
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See what our users have to say about DUTGrad
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  {/* <img
                    src="/placeholder.svg?height=60&width=60"
                    alt="User Avatar"
                    className="rounded-full"
                    width={60}
                    height={60}
                  /> */}
                  <div>
                    <h3 className="font-bold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Research Director, Acme Inc.</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {
                    "DUTGrad has transformed how our research team manages documentation. The AI assistant saves us hours of searching through papers and reports."
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  {/* <img
                    src="/placeholder.svg?height=60&width=60"
                    alt="User Avatar"
                    className="rounded-full"
                    width={60}
                    height={60}
                  /> */}
                  <div>
                    <h3 className="font-bold">Michael Chen</h3>
                    <p className="text-sm text-muted-foreground">Legal Counsel, LexCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {
                    "The ability to query across thousands of legal documents and get precise answers has been game-changing for our legal department."
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  {/* <img
                    src="/placeholder.svg?height=60&width=60"
                    alt="User Avatar"
                    className="rounded-full"
                    width={60}
                    height={60}
                  /> */}
                  <div>
                    <h3 className="font-bold">Elena Rodriguez</h3>
                    <p className="text-sm text-muted-foreground">CTO, TechStart</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {
                    "We've integrated DUTGrad with our knowledge base, and it's dramatically improved how quickly our team can access critical information."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works for your needs
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="flex flex-col bg-card">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For individuals and small teams</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Up to 1,000 documents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Basic AI search</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>5 GB storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col bg-card border-primary shadow-lg">
              <CardHeader>
                <div className="py-1 px-3 bg-primary text-primary-foreground text-sm rounded-full w-fit mx-auto mb-2">
                  Most Popular
                </div>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Up to 10,000 documents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Advanced AI search & chatbot</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>25 GB storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Team collaboration</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col bg-card">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Unlimited documents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Custom AI models</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Advanced security & compliance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Document Management?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied users who have revolutionized how they work with documents.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-background text-foreground hover:bg-muted">
                Start Free Trial
              </Button>
              <Button size="lg" className="border-primary-foreground hover:bg-primary/90">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-muted/80 text-foreground">
        <div className="container px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">DUTGrad</h3>
              <p className="text-sm text-muted-foreground">
                Smart document storage and retrieval powered by artificial intelligence.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DUTGrad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
