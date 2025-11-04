import { Outlet } from "react-router-dom";
// import './Layout.css'
import Navbar from "../../src/components/Navbar/Navbar";
import Footer from "../../src/components/Footer/Footer";  // ✅ <-- Agregado

const Layout = () => {
    return (
        <>
            <Navbar></Navbar>
            <main className="container-section">
                <Outlet />
            </main>
            <Footer />  {/* ✅ Agregado, aparece solo si corresponde */}
        </>
    );
};

export default Layout;
