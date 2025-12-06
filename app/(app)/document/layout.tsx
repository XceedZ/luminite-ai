import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Document",
    description: "Create and edit documents with AI-powered writing assistant",
};

export default function DocumentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
