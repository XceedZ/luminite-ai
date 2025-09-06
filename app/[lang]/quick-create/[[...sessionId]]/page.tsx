import "server-only";
import { getDictionary } from "@/lib/dictionaries";
import QuickCreateClientUI from "./quick-create-client";
import type { Metadata } from "next";
import { findNavItemByHref } from "@/lib/nav-utils";

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    lang: string;
    sessionId?: string[];
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const navItem = findNavItemByHref("quick-create");
  return {
    title: navItem?.title || "Quick Create",
  };
}

// Jangan destructure 'params' langsung dalam parameter
export default async function QuickCreatePage(props: Props) {
  // Akses 'params' dari props
  const dictionary = await getDictionary(props.params.lang);

  const sessionId = props.params.sessionId?.[0];

  return <QuickCreateClientUI dictionary={dictionary} sessionId={sessionId} />;
}
