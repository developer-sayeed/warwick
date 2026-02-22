import FloatingCallButton from "@/components/FloatingCallButton";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MenuSection } from "@/components/menu-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MenuSection />
      <FloatingCallButton phoneNumber="+966501234567" />
      <Footer />
    </main>
  );
}
