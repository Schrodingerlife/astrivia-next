import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ToolsLayout({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
