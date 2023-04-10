import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import TutorApplicationSection from "./applicationSection";
import CoreSubjectsSection from "./coreSubject";
import FaqSection from "./faqs";
import FirstSection from "./firstSection";
import HeroSection from "./hero";
import TestimonialSection from "./testimonials";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <FirstSection />
        <CoreSubjectsSection />
        <TutorApplicationSection />
        <TestimonialSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
