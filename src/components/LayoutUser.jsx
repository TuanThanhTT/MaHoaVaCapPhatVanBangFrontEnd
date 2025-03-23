import HeaderUser from "./HeaderUser"
import Footer from "./Footer";
function LayoutUser({ children }) {

    return (
        <>
            <HeaderUser />
            {children}
            <Footer />
        </>
    );
}

export default LayoutUser;