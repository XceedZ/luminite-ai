import "server-only";
import type { Metadata } from "next";
import { findNavItemByHref } from "@/lib/nav-utils";
import QuickCreateClientUI from "./quick-create-client";

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    sessionId?: string[];
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const navItem = findNavItemByHref("quick-create");
  return {
    title: navItem?.title || "Quick Create",
  };
}

export default async function QuickCreatePage(props: Props) {
  const sessionId = props.params.sessionId?.[0];
  return <QuickCreateClientUI sessionId={sessionId} />;
}


