import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

Modal.setAppElement("#root");

export default function DiplomaQueryHistory() {
    const [queries, setQueries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(true);

    useEffect(() => {
        fetchQueries();
    }, [currentPage]);

    const fetchQueries = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            const response = await axios.get(
                `http://localhost:8080/admin/query/all?page=${currentPage}&size=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setQueries(
                response.data.content.map((query) => ({
                    id: query.id.toString(),
                    userName: query.userName || "",
                    timeQuery: query.timeQuery || "",
                    status: query.status || "Không xác định",
                    studentName: query.studentName || "",
                    idAddress: query.idAddress || "",
                    deviceInfo: query.deviceInfo || "",
                }))
            );
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
            setShowPagination(response.data.totalPages > 1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách truy vấn:", error);
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                "Không thể lấy danh sách truy vấn. Vui lòng kiểm tra kết nối hoặc đăng nhập lại."
            );
            setQueries([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        if (totalPages === 0) return [];
        const visiblePages = 5;
        const half = Math.floor(visiblePages / 2);
        let start = Math.max(currentPage - half, 0);
        let end = Math.min(start + visiblePages, totalPages);
        if (end - start < visiblePages) {
            start = Math.max(end - visiblePages, 0);
        }
        return Array.from({ length: end - start }, (_, i) => start + i);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Thông điệp hợp lệ":
                return "text-green-700";
            case "Thông điệp không hợp lệ":
                return "text-red-700";
            case "Đang xử lý":
                return "text-yellow-700";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Lịch Sử Tra Cứu Văn Bằng</h1>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">Mã truy vấn</th>
                            <th className="p-3">Tên người dùng</th>
                            <th className="p-3">Thời gian truy vấn</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3">Tên sinh viên</th>
                            <th className="p-3">Mã định danh</th>
                            <th className="p-3">Thông tin thiết bị</th>
                        </tr>
                    </thead>

                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="7" className="p-3 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : queries.length > 0 ? (
                                queries.map((query) => (
                                    <motion.tr
                                        key={query.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center font-semibold text-blue-600">{query.id}</td>
                                        <td className="p-3 text-center">{query.userName}</td>
                                        <td className="p-3 text-center">{query.timeQuery}</td>
                                        <td className={`p-3 text-center ${getStatusStyles(query.status)}`}>
                                            {query.status}
                                        </td>
                                        <td className="p-3 text-center">{query.studentName}</td>
                                        <td className="p-3 text-center">{query.idAddress}</td>
                                        <td className="p-3 text-center">{query.deviceInfo}</td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="7" className="p-3 text-center text-gray-500">
                                        Không tìm thấy truy vấn
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <motion.button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || isLoading}
                        className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full disabled:from-gray-300 disabled:to-gray-400 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <ChevronLeftIcon />
                        </svg>
                    </motion.button>

                    <div className="flex space-x-1">
                        {getPageNumbers().map((page) => (
                            <motion.button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-full shadow-md text-sm font-semibold ${currentPage === page
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isLoading}
                            >
                                {page + 1}
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1 || isLoading}
                        className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full disabled:from-gray-300 disabled:to-gray-400 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <ChevronRightIcon />
                        </svg>
                    </motion.button>
                </div>
            )}

            {/* Error Modal */}
            {errorMessage && (
                <Modal
                    isOpen={!!errorMessage}
                    onRequestClose={() => setErrorMessage("")}
                    className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">{errorMessage}</h2>
                        <div className="flex justify-center">
                            <motion.button
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setErrorMessage("")}
                            >
                                Đóng
                            </motion.button>
                        </div>
                    </motion.div>
                </Modal>
            )}
        </div>
    );
}