import { useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen">
            {/* Hàng 1: Sidebar + Nội dung */}
            <div className="flex flex-1">
                {/* Sidebar (HeaderAdmin) */}
                <HeaderAdmin isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Nội dung chính */}
                <div className="flex-1 flex flex-col">
                    {/* Hàng 1: Thanh tiêu đề */}
                    <div className="bg-white shadow-md p-4 font-bold text-red-600 text-3xl uppercase">
                        CertiCrypt
                    </div>

                    {/* Hàng 2: Chỗ chứa nội dung */}
                    <div className="flex-1 overflow-auto mt-6">
                        {children}
                    </div>
                </div>
            </div>

            {/* Hàng 2: Footer */}
            <Footer />
        </div>
    );
};

export default AdminLayout;
