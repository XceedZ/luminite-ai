import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Diagram",
    description: "Create beautiful diagrams with drag and drop",
};

export default function DiagramLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
