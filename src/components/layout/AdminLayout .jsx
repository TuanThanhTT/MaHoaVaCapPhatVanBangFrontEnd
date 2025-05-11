import { useNavigate } from 'react-router-dom';
import HeaderAdmin from "../HeaderAdmin";
import { jwtDecode } from 'jwt-decode';

function AdminLayout({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    let user = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = { name: decoded.sub }; // Giả sử 'sub' chứa tên người dùng
        } catch (error) {
            localStorage.removeItem('jwtToken');
            navigate('/login');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
        <div className="flex">
            <HeaderAdmin user={user} onLogout={handleLogout} />
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;