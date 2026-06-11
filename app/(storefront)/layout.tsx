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
    <div className="bg-[#f0ede8]">
      {/* White content card centred on a warm-gray page, matching the prototype */}
      <div className="mx-auto min-h-screen max-w-[1400px] bg-white shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <AnnouncementBar />
        <Header nav={nav} />
        <main>{children}</main>
        <Footer nav={nav} business={business} social={social} />
      </div>
      <FloatingButtons />
    </div>
  );
}
