import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaChartBar, FaUserCog, FaFileAlt, FaSignOutAlt,
    FaChevronDown, FaChevronUp, FaHistory, FaBars, FaTimes, FaCog, FaLock
} from "react-icons/fa";
import { FileCheck } from "lucide-react";

const HeaderAdmin = ({ user, onLogout }) => {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAccountOpen, setAccountOpen] = useState(false);
    const [isDiplomaOpen, setDiplomaOpen] = useState(false);
    const [isActivityOpen, setActivityOpen] = useState(false);
    const [isSettingOpen, setSettingOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname.includes("/account")) setAccountOpen(true);
        if (location.pathname.includes("/diploma")) setDiplomaOpen(true);
        if (location.pathname.includes("/activity")) setActivityOpen(true);
        if (location.pathname.includes("/setting")) setSettingOpen(true);
        if (location.pathname.includes("/change-password")) setActiveItem("/change-password");
        setActiveItem(location.pathname);
    }, [location.pathname]);

    return (
        <>
            {/* Nút mở Sidebar trên mobile */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-[#800020] text-white p-2 rounded-md"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 lg:relative`}>
                {/* Avatar và lời chào */}
                <div className="text-center mb-4">
                    <img src="../logofinish.png" alt="logo" className="w-auto rounded-full mx-auto mb-2 border border-gray-300" />
                    <h2
                        className="text-base font-semibold truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                        title={user?.name || "Quản trị viên"}
                    >
                        Xin chào, {user?.name || "Quản trị viên"}
                    </h2>
                    <hr className="border-gray-400 mt-3" />
                </div>

                {/* Danh sách menu */}
                <ul>
                    <li className="mb-2">
                        <Link to="/dashboard" onClick={() => setActiveItem("/dashboard")}
                            className={`flex items-center p-2 rounded transition-all duration-200 
                            ${activeItem === "/dashboard" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                            <FaChartBar className="mr-2" /> Thống kê
                        </Link>
                    </li>

                    {/* Quản lý tài khoản */}
                    <li className="mb-2">
                        <button onClick={() => setAccountOpen(!isAccountOpen)}
                            className="flex items-center justify-between w-full p-2 rounded transition-all duration-200 hover:bg-[#800020] hover:text-white">
                            <span className="flex items-center">
                                <FaUserCog className="mr-2" /> Quản lý tài khoản
                            </span>
                            {isAccountOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isAccountOpen ? "max-h-40" : "max-h-0"}`}>
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to="/account/roles" onClick={() => setActiveItem("/account/roles")}
                                        className={`block p-2 rounded ${activeItem === "/account/roles" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        🔑 Phân quyền
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/account/manage" onClick={() => setActiveItem("/account/manage")}
                                        className={`block p-2 rounded ${activeItem === "/account/manage" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        👤 Quản lý tài khoản
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Quản lý văn bằng */}
                    <li className="mb-2">
                        <button onClick={() => setDiplomaOpen(!isDiplomaOpen)}
                            className="flex items-center justify-between w-full p-2 rounded transition-all duration-200 hover:bg-[#800020] hover:text-white">
                            <span className="flex items-center">
                                <FaFileAlt className="mr-2" /> Quản lý văn bằng
                            </span>
                            {isDiplomaOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isDiplomaOpen ? "max-h-40" : "max-h-0"}`}>
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to="/diploma/review" onClick={() => setActiveItem("/diploma/review")}
                                        className={`block p-2 rounded ${activeItem === "/diploma/review" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        🔍 Duyệt văn bằng
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/diploma/create" onClick={() => setActiveItem("/diploma/create")}
                                        className={`block p-2 rounded ${activeItem === "/diploma/create" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        📝 Tạo mới văn bằng
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/diploma/verify"
                                        onClick={() => setActiveItem("/diploma/verify")}
                                        className={`flex items-center gap-2 p-2 rounded ${activeItem === "/diploma/verify" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        <FileCheck size={20} />
                                        Xác thực văn bằng
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Lịch sử hoạt động */}
                    <li className="mb-2">
                        <button onClick={() => setActivityOpen(!isActivityOpen)}
                            className="flex items-center justify-between w-full p-2 rounded transition-all duration-200 hover:bg-[#800020] hover:text-white">
                            <span className="flex items-center">
                                <FaHistory className="mr-2" /> Lịch sử hoạt động
                            </span>
                            {isActivityOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isActivityOpen ? "max-h-40" : "max-h-0"}`}>
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to="/activity/search" onClick={() => setActiveItem("/activity/search")}
                                        className={`block p-2 rounded ${activeItem === "/activity/search" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        🔍 Lịch sử tra cứu
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Cài đặt */}
                    <li className="mb-2">
                        <button onClick={() => setSettingOpen(!isSettingOpen)}
                            className="flex items-center justify-between w-full p-2 rounded transition-all duration-200 hover:bg-[#800020] hover:text-white">
                            <span className="flex items-center">
                                <FaCog className="mr-2" /> Cài đặt
                            </span>
                            {isSettingOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isSettingOpen ? "max-h-40" : "max-h-0"}`}>
                            <ul className="ml-6 mt-2">

                                <li>
                                    <Link to="/settings/faculty" onClick={() => setActiveItem("/settings/faculty")}
                                        className={`block p-2 rounded ${activeItem === "/settings/faculty" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        🏛️ Khoa
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings/students" onClick={() => setActiveItem("/settings/students")}
                                        className={`block p-2 rounded ${activeItem === "/settings/students" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}>
                                        🎓 Sinh viên
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Đổi mật khẩu */}
                    <li className="mb-2">
                        <Link
                            to="/change-password"
                            onClick={() => setActiveItem("/change-password")}
                            className={`flex items-center p-2 rounded transition-all duration-200 
                            ${activeItem === "/change-password" ? "bg-[#800020] text-white" : "hover:bg-[#800020] hover:text-white"}`}
                        >
                            <FaLock className="mr-2" /> Đổi mật khẩu
                        </Link>
                    </li>

                    {/* Đăng xuất */}
                    <li className="mb-2">
                        <button
                            onClick={onLogout}
                            className="flex items-center p-2 rounded transition-all duration-200 hover:bg-[#800020] hover:text-white w-full text-left"
                        >
                            <FaSignOutAlt className="mr-2" /> Đăng xuất
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default HeaderAdmin;