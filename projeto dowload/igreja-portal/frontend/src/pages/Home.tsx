import Hero from "../components/home/Hero";
import CultosSection from "../components/home/CultosSection";
import LiveSection from "../components/home/LiveSection";
import NewsSection from "../components/home/NewsSection";
import EventsSection from "../components/home/EventsSection";
import CtaSection from "../components/home/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <CultosSection />
      <LiveSection />
      <NewsSection />
      <EventsSection />
      <CtaSection />
    </>
  );
}
