import { TopRibbon } from "../components/navigation/top-ribbon";
import { CountdownHero } from "../components/hero/countdown-hero";
import { WhatIsAtStake } from "../components/stake/what-is-at-stake";
import { HowWeHelp } from "../components/help/how-we-help";
import { ContactSection } from "../components/contact/contact-section";
import { MinimalFooter } from "../components/navigation/minimal-footer";

export default function Home() {
  return (
    <>
      <TopRibbon />
      <CountdownHero />
      <WhatIsAtStake />
      <HowWeHelp />
      <ContactSection />
      <MinimalFooter />
    </>
  );
}

