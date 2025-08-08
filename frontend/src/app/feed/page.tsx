import Footer from "@/components/Footer";
import { Navbar } from "@/components/NavBar";
import { UnderConstruction } from "@/components/UnderConstraction";

export default function page() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <UnderConstruction />
            </div>
            <Footer />
        </>
    );
}

