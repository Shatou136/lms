
// import { Badge } from "@/components/ui/badge";
// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

// interface featureProps {
//     title: string;
//     description: string;
//     icon: string;
// }

// const features: featureProps[] = [
//     {
//     title: "Comprehensive Courses",
//     description: 
//       "Access a wide range of carefully curated courses designed by industry experts.",
//     icon: "📚",
//     },
//     {
//         title: "Interactive Learning",
//         description: 
//           "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
//         icon: "🎮",
//     },
//     {
//         title: "Progress Tracking",
//         description: 
//           "Monitor your progress and achievements with detailed analytics and personalized dashboard.",
//         icon: "📊",
//     },
//     {
//         title: "Community Support",
//         description: 
//           "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
//         icon: "🤝",
//     },
// ];

// export default function Home() {
  
    
//   return (
//    <>
//    <section className="relative py-20" >
//     <div className="flex flex-col items-center text-center space-y-8">
//         <Badge variant="outline">
//             The Future of Online Education
//         </Badge>
//          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your Learning Experience</h1>
//          <p className="max-w-[700px] text-muted-foreground md:text-xl">
//             Discover a new way to learn with our modern, interactive Learning management 
//             system. Access high-quality courses anytime, anywhere.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 mt-8">
//                 <Link
//                 className={buttonVariants({
//                     size: "lg",
//                 })} 
//                 href="/courses"
//                 >
//                  Explore Courses
//                  </Link>

//                    <Link
//                 className={buttonVariants({
//                     size: "lg",
//                     variant: "outline",
//                 })} 
//                 href="/login"
//                 >
//                  Sign in
//                  </Link>
//             </div>
//     </div>
//    </section>

//    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
//      {features.map((feature, index) => (
//         <Card key={index} className="hover:shadow-lg transition-shadow">
//          <CardHeader>
//           <div className="text-4xl mb-4">{feature.icon}</div>
//           <CardTitle>{feature.title}</CardTitle>
//          </CardHeader>
//          <CardContent>
//           <p className="text-muted-foreground">{feature.description}</p>
//          </CardContent>
//         </Card>
//      ))}
//    </section>
//    </>
//   );
// }





import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  Video,
  BarChart3,
  Clock,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ── Platform features — real descriptions, no fake claims ──────────────────
const features = [
  {
    title: "Structured Course Paths",
    description:
      "Every course is organized into chapters and lessons that build logically on each other, so you always know where you are and what comes next.",
    icon: BookOpen,
  },
  {
    title: "Video-First Learning",
    description:
      "Watch high-quality video lessons with thumbnail previews, full playback controls, and the ability to rewatch any lesson at any time.",
    icon: Video,
  },
  {
    title: "Real Progress Tracking",
    description:
      "Mark lessons as complete, see your percentage progress per course, and track your daily learning streak right from your dashboard.",
    icon: BarChart3,
  },
  {
    title: "Learn at Your Own Pace",
    description:
      "There are no deadlines. Access your enrolled courses any time — morning, evening, or on weekends. Progress is saved automatically.",
    icon: Clock,
  },
  {
    title: "Access from Any Device",
    description:
      "Pick up where you left off whether you are on your phone, tablet, or laptop. Your account syncs across all devices.",
    icon: Globe,
  },
  {
    title: "Secure & Local Payments",
    description:
      "Pay with international cards via Stripe, or use Mobile Money (Orange Money or MTN MoMo) — designed for learners in Cameroon.",
    icon: Shield,
  },
];

// ── How the platform works ──────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up with your GitHub account or email address. No credit card is needed just to browse courses.",
  },
  {
    number: "02",
    title: "Browse and Choose a Course",
    description:
      "Explore courses across 11 categories, filtered by skill level — Beginner, Intermediate, or Advanced.",
  },
  {
    number: "03",
    title: "Enroll with Your Preferred Payment",
    description:
      "Pay securely using Stripe (international cards) or Mobile Money (Orange Money / MTN MoMo). Access is instant after payment.",
  },
  {
    number: "04",
    title: "Learn and Track Your Growth",
    description:
      "Watch lessons, mark them complete, build your daily streak, and monitor your overall progress from your personal dashboard.",
  },
];

// ── Course categories available on the platform ────────────────────────────
const categories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Personal Development",
  "Teaching & Academics",
  "Office Productivity",
];

// ── What is included when you enroll ──────────────────────────────────────
const enrollmentBenefits = [
  "Full lifetime access to the course",
  "Watch on mobile, tablet, or desktop",
  "Certificate of completion",
  "30-day money-back guarantee",
  "Access to all future course updates",
];

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />

        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium">
            🎓 A Learning Platform Built for Cameroon
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Learn Skills That{" "}
            <span className="text-primary">Open Doors</span>
          </h1>

          <p className="max-w-2xl text-muted-foreground md:text-xl leading-relaxed">
            ShatouLMS gives you structured video courses, real progress
            tracking, and flexible payment options — including Mobile Money —
            so that quality education is accessible to every learner in
            Cameroon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/courses"
              className={buttonVariants({ size: "lg" })}
            >
              Browse All Courses <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Create Free Account
            </Link>
          </div>

          {/* ── Quick stats bar ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full max-w-2xl pt-8 border-t">
            {[
              { value: "11+", label: "Course Categories" },
              { value: "3", label: "Skill Levels" },
              { value: "2", label: "Payment Methods" },
              { value: "Daily", label: "Streak Tracking" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Learn Effectively
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Every feature on ShatouLMS is built around one goal: keeping you
            focused and making real progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30 rounded-2xl px-6 md:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How ShatouLMS Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From account creation to completing your first lesson in four
            simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line between steps (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[58%] w-full h-px bg-border z-0" />
              )}
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-4 shrink-0">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Course Categories ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            11 Categories to Explore
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whatever you want to learn — a career skill, a creative hobby, or
            professional development — there is a category for you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat}
              href="/courses"
              className="px-4 py-2 rounded-full border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-sm font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Payment Methods ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 rounded-2xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Pay the Way That Works for You
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              ShatouLMS supports both international card payments and local
              Mobile Money — because no learner in Cameroon should be blocked
              from accessing education due to payment barriers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background text-sm font-medium">
                💳 Stripe (Debit / Credit Cards)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background text-sm font-medium">
                🟠 Orange Money
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background text-sm font-medium">
                🟡 MTN Mobile Money
              </span>
            </div>
          </div>

          <div className="space-y-3 shrink-0">
            {enrollmentBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 text-center mb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Your Next Skill Starts Here
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Browse published courses across 11 categories. Enroll instantly
            using your preferred payment method and start learning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              View All Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}