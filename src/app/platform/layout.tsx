import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function PlatformLayout({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
