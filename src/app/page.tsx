import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AppSimulation from "@/components/app-simulation";
import FeaturesGrid from "@/components/features-grid";
import TechStack from "@/components/tech-stack";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-white text-zinc-900">
      <Navbar />
      <Hero />
      <AppSimulation />
      <FeaturesGrid />
      <TechStack />
      <Footer />
    </main>
  );
}
