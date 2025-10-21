import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Brain,
  Zap,
  Database,
  Code2,
  FileText,
  ArrowRight,
  CheckCircle2,
  Upload,
  Search,
  FileCheck,
  Mail,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-primary/30 bg-primary/5"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary" />
            AI-Powered Job Matching Platform
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight px-4">
            Career Co-Pilot
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
            Full-stack AI platform showcasing custom machine learning algorithms for intelligent CV analysis and job
            matching
          </p>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Built from scratch to demonstrate deep understanding of ML fundamentals, full-stack development, and modern
            cloud architecture
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group">
              <Link href="/jobs">
                Explore Job Matches
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Highlights */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Custom ML Algorithm", icon: Brain },
              { label: "NLP with spaCy", icon: Sparkles },
              { label: "Next.js 15 + FastAPI", icon: Code2 },
              { label: "PostgreSQL + AWS", icon: Database },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <tech.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary" />
                <p className="text-xs sm:text-sm font-medium text-foreground leading-tight">{tech.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Intelligent job matching powered by custom machine learning algorithms
            </p>
          </div>

          <div className="relative grid md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Upload,
                title: "Upload CV",
                description: "Upload your PDF resume for intelligent analysis using NLP",
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "spaCy extracts skills, experience, and qualifications automatically",
              },
              {
                icon: Search,
                title: "Smart Matching",
                description: "Custom TF-IDF algorithm calculates job similarity scores",
              },
              {
                icon: FileCheck,
                title: "Get Results",
                description: "View ranked matches with AI-generated cover letters",
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col">
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {/* Arrow between cards - only show on desktop */}
                {i < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10">
                    <div className="bg-background/80 backdrop-blur-sm rounded-full p-1">
                      <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-primary/60" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">Technical Highlights</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Demonstrating full-stack expertise and ML fundamentals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: Brain,
                title: "Custom TF-IDF Implementation",
                description:
                  "Built from scratch to understand ML mathematics: term frequency, inverse document frequency, and cosine similarity calculations",
                tech: ["Python", "NumPy", "Multi-threading"],
              },
              {
                icon: Sparkles,
                title: "NLP-Powered CV Analysis",
                description:
                  "spaCy named entity recognition with custom regex patterns for extracting skills, experience, education, and contact information",
                tech: ["spaCy", "pdfplumber", "Custom NER"],
              },
              {
                icon: Code2,
                title: "Modern Full-Stack Architecture",
                description:
                  "Next.js 15 with React Server Components, FastAPI backend, type-safe database queries with Drizzle ORM",
                tech: ["Next.js 15", "FastAPI", "TypeScript"],
              },
              {
                icon: Database,
                title: "Optimized Database Design",
                description:
                  "PostgreSQL with JSONB storage, denormalized fields for performance, caching layer for similarity scores",
                tech: ["PostgreSQL", "Drizzle ORM", "AWS S3"],
              },
              {
                icon: Zap,
                title: "AI Cover Letter Generation",
                description:
                  "Context-aware prompts using DeepSeek API with professional PDF generation and custom styling",
                tech: ["DeepSeek API", "React PDF", "Prompt Engineering"],
              },
              {
                icon: FileText,
                title: "Production-Ready Features",
                description:
                  "Clerk authentication, server-side pagination, debounced search, responsive design, error handling",
                tech: ["Clerk Auth", "SSR", "Tailwind CSS"],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tech.map((t, j) => (
                    <Badge
                      key={j}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20 text-xs sm:text-sm"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">Tech Stack</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Modern technologies and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                category: "Frontend",
                technologies: ["Next.js 15 (React 19)", "TypeScript", "Tailwind CSS", "Clerk Auth", "React PDF"],
              },
              {
                category: "Backend & ML",
                technologies: ["FastAPI (Python)", "spaCy NLP", "Custom TF-IDF", "DeepSeek API", "RESTful APIs"],
              },
              {
                category: "Database & Cloud",
                technologies: ["PostgreSQL (Neon)", "Drizzle ORM", "AWS S3", "JSONB Storage", "Pre-signed URLs"],
              },
            ].map((stack, i) => (
              <div key={i} className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-primary">{stack.category}</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {stack.technologies.map((tech, j) => (
                    <li key={j} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
            <Mail className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Ready to See It in Action?</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Explore the job board, upload a CV, and experience the intelligent matching algorithm firsthand
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                <Link href="/jobs">View Job Board</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary/30 hover:bg-primary/5 bg-transparent"
              >
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
