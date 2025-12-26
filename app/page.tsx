
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { Stats } from "@/components/landing/Stats";
import { AdvisoryBoard } from "@/components/landing/AdvisoryBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />
      <Hero />
      <CompanyLogos />
      <Features />
      <Stats />
      <AdvisoryBoard />
      <HowItWorks />
      <Footer />
    </main>
  );
}
