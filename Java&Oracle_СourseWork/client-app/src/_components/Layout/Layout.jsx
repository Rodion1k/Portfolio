import {Link, Outlet} from "react-router-dom";
import Navbar from "../NavBar/NavBar";

const Layout = () => {
    return (
        <>
            <header>
                <Navbar/>
            </header>
            <main className="container">
                <Outlet/>
            </main>
        </>
    );
}
export default Layout;