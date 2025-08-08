import Footer from "@/components/Footer";
import { Navbar } from "@/components/NavBar";
import { UploadPage } from "@/components/pages/UploadPage";

export default function page() {
    return (
        <>
            <Navbar />
            {/* <div className="flex flex-col items-center justify-center min-h-screen"> */}
                {/* <UnderConstruction /> */}
                <UploadPage />
            {/* </div> */}
            <Footer />
        </>
    );
}

