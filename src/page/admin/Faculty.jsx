import { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import axios from "axios";

Modal.setAppElement("#root");

const Faculty = () => {
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [editDepartment, setEditDepartment] = useState(null);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
    const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);
    const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const navigate = useNavigate();

    const removeVietnameseDiacritics = (str) => {
        if (!str) return "";
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    const getAuthConfig = () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            throw new Error("Vui lòng đăng nhập để tiếp tục.");
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
    };

    const fetchFaculties = async (page, search) => {
        try {
            setIsLoading(true);
            let url;
            let response;

            const isNumeric = (str) => /^\d+$/.test(str.trim());
            console.log("Search term:", search, "Is numeric:", isNumeric(search));

            const config = getAuthConfig();

            if (isNumeric(search)) {
                url = `http://localhost:8080/admin/faculty/${search}`;
                console.log("Calling API by ID:", url);
                response = await axios.get(url, config);
                console.log("API response (by ID):", response.data);
                setDepartments([{
                    id: response.data.id,
                    name: response.data.facultyName || "",
                    code: response.data.facultyName
                        ? response.data.facultyName.split(" ").map(word => word[0]?.toUpperCase() || "").join("")
                        : ""
                }]);
                setTotalPages(1);
                setShowPagination(false);
            } else {
                const normalizedSearch = search;
                url = `http://localhost:8080/admin/faculty/search?name=${encodeURIComponent(normalizedSearch)}&page=${page}&size=${pageSize}`;
                console.log("Calling API by name:", url);
                response = await axios.get(url, config);
                console.log("API response (by name):", response.data);

                if (!response.data.content) {
                    throw new Error("Dữ liệu trả về không hợp lệ!");
                }

                setDepartments(response.data.content.map(faculty => {
                    const facultyName = faculty.facultyName || "";
                    return {
                        id: faculty.id,
                        name: facultyName,
                        code: facultyName
                            ? facultyName.split(" ").map(word => word[0]?.toUpperCase() || "").join("")
                            : ""
                    };
                }));
                setTotalPages(response.data.totalPages || 0);
                setShowPagination(true);

                if (page >= (response.data.totalPages || 0) && response.data.totalPages > 0) {
                    setCurrentPage(response.data.totalPages - 1);
                }
            }
        } catch (error) {
            console.error("Error in fetchFaculties:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || error.response?.status === 403 || error.message.includes("đăng nhập")) {
                setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setIsErrorModalOpen(true);
                setTimeout(() => {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                }, 2000);
            } else {
                setError(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
            }
            setDepartments([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetchFaculties = useCallback(
        debounce((page, search) => {
            fetchFaculties(page, search);
        }, 1000),
        []
    );

    useEffect(() => {
        debouncedFetchFaculties(currentPage, searchTerm);
        return () => {
            debouncedFetchFaculties.cancel();
        };
    }, [currentPage, searchTerm, debouncedFetchFaculties]);

    const addOrEditDepartment = async () => {
        if (!newDepartmentName.trim()) {
            setError("Tên khoa không được để trống!");
            setIsErrorModalOpen(true);
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        const url = editDepartment
            ? `http://localhost:8080/admin/faculty/update/${editDepartment.id}`
            : "http://localhost:8080/admin/faculty/add";

        try {
            const config = getAuthConfig();
            const response = await axios({
                method: editDepartment ? "PUT" : "POST",
                url,
                ...config,
                data: { facultyName: newDepartmentName, isDelete: false },
            });

            setNewDepartmentName("");
            setIsModalOpen(false);
            if (editDepartment) {
                setIsEditSuccessModalOpen(true);
            } else {
                setIsAddSuccessModalOpen(true);
            }
            setEditDepartment(null);
            debouncedFetchFaculties(currentPage, searchTerm);

            setTimeout(() => {
                setIsAddSuccessModalOpen(false);
                setIsEditSuccessModalOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Error in addOrEditDepartment:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || error.response?.status === 403 || error.message.includes("đăng nhập")) {
                setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setIsErrorModalOpen(true);
                setTimeout(() => {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                }, 2000);
            } else {
                setError(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDepartment = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này?")) return;

        try {
            const config = getAuthConfig();
            await axios.delete(`http://localhost:8080/admin/faculty/delete/${id}`, config);

            const remainingDepartments = departments.filter(dept => dept.id !== id);
            if (remainingDepartments.length === 0 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                debouncedFetchFaculties(currentPage, searchTerm);
            }

            setIsDeleteSuccessModalOpen(true);
            setTimeout(() => {
                setIsDeleteSuccessModalOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Error in deleteDepartment:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || error.response?.status === 403 || error.message.includes("đăng nhập")) {
                setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setIsErrorModalOpen(true);
                setTimeout(() => {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                }, 2000);
            } else {
                setError(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageNumbers = () => {
        const maxButtons = 5;
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(0, currentPage - half);
        let end = Math.min(totalPages, start + maxButtons);

        if (end - start < maxButtons) {
            start = Math.max(0, end - maxButtons);
        }

        return Array.from({ length: end - start }, (_, i) => start + i);
    };

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Quản lý Khoa</h2>
            <div className="flex mb-4 space-x-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã khoa hoặc tên khoa..."
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <motion.button
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-green-600 hover:to-teal-600 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsModalOpen(true); setEditDepartment(null); setNewDepartmentName(""); }}
                    disabled={isLoading}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Thêm Khoa
                </motion.button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Mã khoa</th>
                            <th className="p-3">Tên khoa</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {departments.length > 0 ? (
                                departments.map((dept, index) => (
                                    <motion.tr
                                        key={dept.id}
                                        className="border-b hover:bg-gray-50 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center">{currentPage * pageSize + index + 1}</td>
                                        <td className="p-3 text-center font-semibold text-blue-600">{dept.id}</td>
                                        <td className="p-3 text-center">{dept.name}</td>
                                        <td className="p-3 flex justify-center space-x-2">
                                            <button
                                                className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-1.5 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 border border-blue-600 hover:from-blue-800 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                                onClick={() => navigate(`/settings/faculty/${dept.id}/departments`)}
                                                disabled={isLoading}
                                            >
                                                📜 <span className="ml-1">Chuyên ngành</span>
                                            </button>
                                            <button
                                                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-1.5 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 border border-gray-300 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setEditDepartment(dept);
                                                    setNewDepartmentName(dept.name);
                                                }}
                                                disabled={isLoading}
                                            >
                                                <PencilSquareIcon className="w-4 h-4 mr-1.5" /> <span>Sửa</span>
                                            </button>
                                            <button
                                                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1.5 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 border border-red-500 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                                onClick={() => deleteDepartment(dept.id)}
                                                disabled={isLoading}
                                            >
                                                <TrashIcon className="w-4 h-4 mr-1.5" /> <span>Xóa</span>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="4" className="p-3 text-center text-gray-500">
                                        Không tìm thấy dữ liệu
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {showPagination && totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <motion.button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || isLoading}
                        className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full disabled:from-gray-300 disabled:to-gray-400 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
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
                        <ChevronRightIcon className="w-5 h-5" />
                    </motion.button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold mb-4">{editDepartment ? "Chỉnh sửa Khoa" : "Thêm Khoa Mới"}</h2>
                <input
                    type="text"
                    placeholder="Nhập tên khoa"
                    className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    disabled={isLoading}
                />
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={addOrEditDepartment}
                        className={`px-4 py-2 rounded-lg text-white flex items-center ${isLoading ? "bg-green-300 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            editDepartment ? "Cập Nhật" : "Thêm"
                        )}
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isAddSuccessModalOpen}
                onRequestClose={() => setIsAddSuccessModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckCircleIcon className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Thêm khoa thành công!</h2>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsAddSuccessModalOpen(false)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600"
                        >
                            Đóng
                        </button>
                    </div>
                </motion.div>
            </Modal>

            <Modal
                isOpen={isEditSuccessModalOpen}
                onRequestClose={() => setIsEditSuccessModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckCircleIcon className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Cập nhật khoa thành công!</h2>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsEditSuccessModalOpen(false)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600"
                        >
                            Đóng
                        </button>
                    </div>
                </motion.div>
            </Modal>

            <Modal
                isOpen={isDeleteSuccessModalOpen}
                onRequestClose={() => setIsDeleteSuccessModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckCircleIcon className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Xóa khoa thành công!</h2>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsDeleteSuccessModalOpen(false)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600"
                        >
                            Đóng
                        </button>
                    </div>
                </motion.div>
            </Modal>

            <Modal
                isOpen={isErrorModalOpen}
                onRequestClose={() => setIsErrorModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Lỗi</h2>
                <p className="text-center mb-4">{error}</p>
                <div className="flex justify-center">
                    <button
                        onClick={() => setIsErrorModalOpen(false)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600"
                    >
                        Đóng
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Faculty;