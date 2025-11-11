export const metadata = {
    title: "斗仙",
    description: "斗仙",
};

import Hero from "../../components/newGameActive";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Home() {
    return (
        <>
            {/* <PageIllustration /> */}
                  <AuthProvider>
            <Hero />

        </AuthProvider>
            {/* <Workflows />
      <Features />
      <Testimonials />
      <Cta /> */}
        </>
    );
}
