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
  const { nav, business, social } = await getChrome();

  return (
    <div className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header nav={nav} />
      <main>{children}</main>
      <Footer nav={nav} business={business} social={social} />
      <FloatingButtons />
    </div>
  );
}
