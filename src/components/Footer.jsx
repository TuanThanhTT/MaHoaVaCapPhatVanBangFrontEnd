import {
    FaFacebook, FaYoutube, FaGithub, FaPhone,
    FaEnvelope, FaMapMarkerAlt, FaLinkedin
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-10">
            {/* Tên website */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-[#B91C1C] uppercase tracking-wide">

                </h2>
                <p className="text-gray-300 text-lg font-medium uppercase mt-2">
                    Hệ Thống Cấp Phát & Xác Thực Văn Bằng
                </p>
            </div>

            {/* Grid 4 cột */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-16">
                {/* Giới thiệu */}
                <div className="text-center lg:text-left">
                    <h3 className="text-xl font-semibold mb-4">Giới Thiệu</h3>
                    <p className="text-gray-400 leading-relaxed">
                        CertiCrypt - Hệ thống mã hóa và cấp phát văn bằng trực tuyến an toàn và hiệu quả.
                    </p>
                </div>

                {/* Liên hệ */}
                <div className="text-center lg:text-left">
                    <h3 className="text-xl font-semibold mb-4">Liên Hệ Với Tôi</h3>
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                        <FaPhone className="text-red-400" /> 0393 524 531
                    </p>
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-gray-400 mt-2">
                        <FaEnvelope className="text-blue-400" /> contact@certicrypt.com
                    </p>
                </div>

                {/* Địa chỉ */}
                <div className="text-center lg:text-left">
                    <h3 className="text-xl font-semibold mb-4">Địa Chỉ</h3>
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                        <FaMapMarkerAlt className="text-green-400" /> Phạm Hữu Lầu, P.6, TP. Cao Lãnh, Đồng Tháp, Việt Nam
                    </p>
                </div>

                {/* Nền tảng */}
                <div className="text-center lg:text-left">
                    <h3 className="text-xl font-semibold mb-4">Các Nền Tảng</h3>
                    <div className="flex justify-center lg:justify-start gap-6 text-2xl">
                        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                            <FaGithub />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-500 transition duration-300">
                            <FaYoutube />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition duration-300">
                            <FaFacebook />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
                &copy; {new Date().getFullYear()} CertiCrypt. Phát triển bởi <span className="text-white font-semibold">Nguyễn Tuấn Thanh</span>.
            </div>
        </footer>
    );
}
