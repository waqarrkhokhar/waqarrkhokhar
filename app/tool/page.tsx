import type { Metadata } from "next";
import PoshishWalaTool from "@/components/tool/PoshishWalaTool";

/**
 * Poshish Wala — Business Management Tool.
 *
 * A private, client-side tool for the workshop (clients, payments, expenses,
 * quotations, invoices). It stores everything in the browser and has no public
 * SEO value, so it is kept out of the index.
 */
export const metadata: Metadata = {
  title: "Poshish Wala — Business Tool",
  description:
    "Internal business management tool for Poshish Wala × Comfy Club: clients, payments, expenses, quotations and invoices.",
  robots: { index: false, follow: false },
};

export default function ToolPage() {
  return <PoshishWalaTool />;
}
