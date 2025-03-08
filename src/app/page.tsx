import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 w-full">
        <section className="py-20 w-full">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to DUT Graduate Portal
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              A comprehensive platform for DUT graduates to connect, share experiences, and access resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/50 w-full">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  {/* Icon could go here */}
                </div>
                <h3 className="text-xl font-bold mb-2">Connect with Alumni</h3>
                <p className="text-muted-foreground">
                  Network with fellow graduates and build professional relationships.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  {/* Icon could go here */}
                </div>
                <h3 className="text-xl font-bold mb-2">Resource Library</h3>
                <p className="text-muted-foreground">
                  Access valuable resources to help in your professional journey.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  {/* Icon could go here */}
                </div>
                <h3 className="text-xl font-bold mb-2">Job Opportunities</h3>
                <p className="text-muted-foreground">
                  Discover career opportunities targeted for DUT graduates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-6 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 DUT Graduate Portal. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
