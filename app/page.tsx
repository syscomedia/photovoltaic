import Nav from "@/components/Nav";
import EnergyLayer from "@/components/EnergyLayer";
import Surge from "@/components/Surge";
import HeroSequence from "@/components/HeroSequence";
import SparkSequence from "@/components/SparkSequence";
import {
  Services,
  Projects,
  Stats,
  Process,
  Dawn,
  Contact,
  Footer,
} from "@/components/sections/Sections";

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <EnergyLayer />
      <HeroSequence />
      <Services />
      <Surge />
      <Stats />
      <SparkSequence />
      <Projects />
      <Surge />
      <Process />
      <Dawn />
      <Contact />
      <Footer />
    </main>
  );
}
