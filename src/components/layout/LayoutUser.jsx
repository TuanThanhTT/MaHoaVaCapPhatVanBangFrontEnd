import { useNavigate } from 'react-router-dom';
import HeaderUser from "../HeaderUser";
import Footer from "../Footer";

function LayoutUser({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
        <>
            <HeaderUser onLogout={handleLogout} />
            {children}
            <Footer />
        </>
    );
}

export default LayoutUser;