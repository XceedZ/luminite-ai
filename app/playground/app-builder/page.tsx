import "server-only";
import type { Metadata } from "next";
import { findNavItemByHref } from "@/lib/nav-utils";
import AppBuilderClientUI from "./app-builder-client";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const navItem = findNavItemByHref("playground/app-builder");
  return {
    title: navItem?.title || "App Builder",
  };
}

export default function AppBuilderPage() {
  return <AppBuilderClientUI />;
}
