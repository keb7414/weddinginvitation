import { RevealProvider } from "@/components/RevealProvider";
import { Intro } from "@/components/Intro";
import { ScrollGuide } from "@/components/ScrollGuide";
import { VisitTracker } from "@/components/VisitTracker";
import { Cover } from "@/components/Cover";
import { GreetingPhoto } from "@/components/GreetingPhoto";
import { Invitation } from "@/components/Invitation";
import { FamilyInfo } from "@/components/FamilyInfo";
import { ContactAccordion } from "@/components/ContactAccordion";
import { Calendar } from "@/components/Calendar";
import { Gallery } from "@/components/Gallery";
import { LocationMap } from "@/components/LocationMap";
import { AccountInfo } from "@/components/AccountInfo";
import { GuestBook } from "@/components/GuestBook";
import { RsvpForm } from "@/components/RsvpForm";
import { ShareButtons } from "@/components/ShareButtons";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[460px] bg-ivory shadow-xl">
      <Intro />
      <ScrollGuide />
      <VisitTracker />
      <RevealProvider>
        <Cover />
        <Invitation />
        <GreetingPhoto />
        <FamilyInfo />
        <ContactAccordion />
        <Calendar />
        <Gallery />
        <LocationMap />
        <AccountInfo />
        <GuestBook />
        <RsvpForm />
        <ShareButtons />
        <Footer />
      </RevealProvider>
    </main>
  );
}
