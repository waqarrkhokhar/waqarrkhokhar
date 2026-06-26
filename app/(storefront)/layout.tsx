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
  const { nav, business, social, announcement, footer, branding } = await getChrome();

  return (
    <div className="min-h-screen w-full bg-white">
      <AnnouncementBar
        enabled={announcement.enabled !== false}
        text={announcement.message || undefined}
        bg={announcement.bg}
        color={announcement.color}
      />
      <Header nav={nav} logo={branding.header_logo} brand={business.name} />
      <main>{children}</main>
      <Footer nav={nav} business={business} social={social} footer={footer} logo={branding.footer_logo} />
      <FloatingButtons />
    </div>
  );
}
