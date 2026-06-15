import { getChrome } from "@/lib/storefront/data";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FloatingButtons from "@/components/storefront/FloatingButtons";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { nav, business, social, announcement, footer } = await getChrome();

  return (
    <div className="min-h-screen w-full bg-white">
      <AnnouncementBar
        enabled={announcement.enabled !== false}
        text={announcement.message || undefined}
        bg={announcement.bg}
        color={announcement.color}
      />
      <Header nav={nav} />
      <main>{children}</main>
      <Footer nav={nav} business={business} social={social} footer={footer} />
      <FloatingButtons />
    </div>
  );
}
