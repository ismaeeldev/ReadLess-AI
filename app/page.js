import Hero from "@/components/home/Hero";
import BgGradient from "@/components/common/bg-gradient";
import Demo from "@/components/home/Demo";
import Step from "@/components/home/Step";
import Pricing from "@/components/home/Pricing";
import Banner from "@/components/home/Banner";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <BgGradient />

      {/* Main content */}
      <div className="relative z-10">
        <Hero />
        <Demo />
        <Step />
        <Pricing />
        <Banner />
      </div>
    </div>
  );
}
