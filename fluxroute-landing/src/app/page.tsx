import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { ServiceRegistry } from "@/components/ServiceRegistry";
import { Pricing } from "@/components/Pricing";
import { DeveloperExperience } from "@/components/DeveloperExperience";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <Features />
        <ServiceRegistry />
        <DeveloperExperience />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
