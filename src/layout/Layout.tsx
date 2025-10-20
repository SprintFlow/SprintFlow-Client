import { Outlet } from "react-router-dom";
// import './Layout.css'
// import Navbar from "src/components/Navbar/Navbar.tsx"

const Layout = () => {
    return (
        <>
            {/* <Navbar></Navbar> */}
            <main className="container-section">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </>
    )
}

export default Layout;