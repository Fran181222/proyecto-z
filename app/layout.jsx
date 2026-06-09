import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Topbar from "@/components/layout/Topbar";
import CartDrawer from "@/components/ui/CartDrawer";
import AuthModal from "@/components/ui/AuthModal";
import WelcomePopup from "@/components/ui/WelcomePopup";
import FloatingContactButton from "@/components/ui/FloatingContactButton";

export const metadata = {
  title: "Malibu Joyería",
  description: "Piezas pensadas para brillar con personalidad.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <WelcomePopup />
            <Topbar />
            <Navbar />
            {children}
            <Footer />
            <FloatingContactButton />
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>

        {/* Bootstrap JS — necesario para dropdown y collapse del navbar */}
        <BootstrapClient />
      </body>
    </html>
  );
}
