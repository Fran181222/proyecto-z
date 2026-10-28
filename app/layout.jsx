import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/app/globals.css";
import { Cormorant_Garamond, Poppins, Ribeye } from "next/font/google";
import BootstrapClient from "@/components/BootstrapClient";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import HideOnAdmin from "@/components/layout/HideOnAdmin";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Topbar from "@/components/layout/Topbar";
import CartDrawer from "@/components/ui/CartDrawer";
import AuthModal from "@/components/ui/AuthModal";
import WelcomePopup from "@/components/ui/WelcomePopup";
import FloatingContactButton from "@/components/ui/FloatingContactButton";

// next/font descarga las fuentes en el build y las sirve desde nuestro propio dominio:
// sin pedidos a Google ni CSS bloqueante.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});
const ribeye = Ribeye({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-ribeye",
});

export const metadata = {
  title: "Malibu Joyería",
  description: "Piezas pensadas para brillar con personalidad.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${poppins.variable} ${cormorant.variable} ${ribeye.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <HideOnAdmin>
              <WelcomePopup />
              <Topbar />
              <Navbar />
            </HideOnAdmin>
            {children}
            <HideOnAdmin>
              <Footer />
              <FloatingContactButton />
              <CartDrawer />
              <AuthModal />
            </HideOnAdmin>
          </CartProvider>
        </AuthProvider>

        {/* Bootstrap JS — necesario para dropdown y collapse del navbar */}
        <BootstrapClient />
      </body>
    </html>
  );
}
