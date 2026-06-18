import { RevealProvider } from "@/components/RevealProvider";
import { Cover } from "@/components/Cover";
import { Invitation } from "@/components/Invitation";
import { FamilyInfo } from "@/components/FamilyInfo";
import { ContactAccordion } from "@/components/ContactAccordion";
import { Calendar } from "@/components/Calendar";
import { Gallery } from "@/components/Gallery";
import { VideoSection } from "@/components/VideoSection";
import { LocationMap } from "@/components/LocationMap";
import { Profile } from "@/components/Profile";
import { Interview } from "@/components/Interview";
import { Notice } from "@/components/Notice";
import { AccountInfo } from "@/components/AccountInfo";
import { GuestBook } from "@/components/GuestBook";
import { FlowerOrder } from "@/components/FlowerOrder";
import { RsvpForm } from "@/components/RsvpForm";
import { AlarmRegister } from "@/components/AlarmRegister";
import { ShareButtons } from "@/components/ShareButtons";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[460px] bg-ivory shadow-xl">
      <RevealProvider>
        <Cover />
        <Invitation />
        <FamilyInfo />
        <ContactAccordion />
        <Calendar />
        <Gallery />
        <VideoSection />
        <LocationMap />
        <Profile />
        <Interview />
        <Notice />
        <AccountInfo />
        <GuestBook />
        <FlowerOrder />
        <RsvpForm />
        <AlarmRegister />
        <ShareButtons />
        <Footer />
      </RevealProvider>
    </main>
  );
}
