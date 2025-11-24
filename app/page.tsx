import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Report from "./components/Report";
import Insights from "./components/Insights";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>

      <Marquee />

      <section id="features">
        <Features />
      </section>

      <section id="report">
        <Report />
      </section>

      <section id="insights">
        <Insights />
      </section>
      
      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </>
  );
}
