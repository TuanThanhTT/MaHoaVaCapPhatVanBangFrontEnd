import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { HiChevronDown, HiMenu, HiX } from "react-icons/hi";
import { jwtDecode } from 'jwt-decode';

export default function HeaderUser({ onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập
    const token = localStorage.getItem('jwtToken');
    let user = null;
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = { name: decoded.sub };
            // Kiểm tra quyền admin
            const roles = decoded.roles ||
                decoded.authorities?.map(auth => auth.authority) ||
                decoded.role ||
                decoded.ROLE ||
                decoded.scopes || [];
            isAdmin = roles.includes('ROLE_ADMINISTRATOR') || roles.includes('ROLE_ADMIN');
        } catch (error) {
            localStorage.removeItem('jwtToken');
            console.error('Invalid token:', error);
        }
    }

    // Chuyển hướng đến dashboard nếu là admin
    useEffect(() => {
        if (user && isAdmin && !location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/settings') && !location.pathname.startsWith('/diploma') && !location.pathname.startsWith('/account') && !location.pathname.startsWith('/change-password')) {
            navigate('/dashboard');
        }
    }, [user, isAdmin, location.pathname, navigate]);

    return (
        <nav className="bg-white bg-opacity-90 backdrop-blur-md text-[#374151] p-4 flex justify-between items-center shadow-lg relative z-[9999]">
            {/* Logo & Tên */}
            <div className="flex items-center gap-2">
                <img src="logofinish.png" alt="CertiCrypt Logo" className="h-14 sm:h-16" />
                <div className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#B91C1C]">
                    CertiCrypt
                </div>
            </div>

            {/* Nút mở menu trên mobile */}
            <button
                className="lg:hidden text-2xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>

            {/* Menu chính */}
            <div
                className={`absolute lg:static top-[4rem] left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-md lg:shadow-none lg:flex lg:items-center lg:gap-6 transition-all duration-300 ${isMenuOpen ? "block" : "hidden"}`}
            >
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 p-4 lg:p-0">
                    {[
                        { path: "/", label: "Trang chủ" },
                        { path: "/About", label: "Giới thiệu" },
                        { path: "/Contact", label: "Liên hệ" },
                        { path: "/ImageUpload", label: "Kiểm tra" }
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`font-semibold transition px-3 py-2 rounded-md ${location.pathname === item.path
                                ? "text-[#B91C1C]"
                                : "hover:text-[#B91C1C]"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Dropdown Văn Bằng */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1 font-semibold transition px-3 py-2 rounded-md hover:text-[#B91C1C]"
                        >
                            Văn bằng
                            <HiChevronDown
                                className={`transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                            />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden transition-all duration-300">
                                <Link
                                    to="/tra-cuu"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Tra cứu
                                </Link>
                                <Link
                                    to="/xem-van-bang"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Xem văn bằng
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Đổi mật khẩu */}
                    {user && (
                        <Link
                            to="/change-password"
                            className={`flex items-center gap-1 font-semibold transition px-3 py-2 rounded-md ${location.pathname === "/change-password"
                                    ? "text-[#B91C1C]"
                                    : "hover:text-[#B91C1C]"
                                }`}
                        >
                            <FaLock className="mr-1" />
                            Đổi mật khẩu
                        </Link>
                    )}
                </div>
            </div>

            {/* Đăng nhập / Đăng xuất / Avatar */}
            <div className="hidden lg:block">
                {user ? (
                    <div className="flex items-center gap-2">
                        <FaUserCircle size={24} />
                        <span>Xin chào, {user.name}</span>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-red-600 text-white h-10 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-200 ease-in-out font-medium"
                        >
                            <FiLogOut size={20} /> Đăng xuất
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-2 bg-black text-white h-10 px-4 rounded-lg shadow-md hover:bg-[#B91C1C] hover:text-white transition duration-200 ease-in-out font-medium"
                    >
                        <FiLogIn size={20} /> Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
}