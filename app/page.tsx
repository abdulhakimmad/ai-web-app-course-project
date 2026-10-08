import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { AppHeader } from "@/components/AppHeader";
import { DetectionPanel } from "@/components/DetectionPanel";
import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
  return (

    <main className="ux-shell">
      <AppHeader />
      <div className="ux-grid">
        <FeatureCard
          title="Object Detection"
          description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
        />
        <FeatureCard
          title="AI Chat"
          description="สนทนากบั Generative AI"
        />
      </div>
      <section className="sp-home-card">
        <div>
          <p className="sp-home-eyebrow">NEW IN WEEK 6</p>
          <h2>Saved Prompts</h2>
          <p>Save and manage prompt ideas for your AI application.</p>
        </div>
        <Link href="/saved-prompts" className="sp-home-link">
          Open Saved Prompts →
        </Link>
      </section>
      <DetectionPanel />
      <ApiStatus />
    </main>
  );
}
