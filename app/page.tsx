import Image from "next/image";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Marquee from "./components/Marquee";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Report from "./components/report/Report";
import Insights from "./components/insights/Insights";
import Contact from "./components/contact/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Header/>
      <Marquee/>
      <Features/>
      <Report/>
      <Insights/>
      <Contact/>
      <Footer/>
    </>
  );
}
