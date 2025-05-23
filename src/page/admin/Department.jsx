import { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Department = ({ facultyId }) => {
    const [majors, setMajors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMajorName, setNewMajorName] = useState("");
    const [newMajorNameEng, setNewMajorNameEng] = useState("");
    const [editMajor, setEditMajor] = useState(null);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

    const fetchMajors = async (search = "", currentPage = page) => {
        try {
            setIsLoading(true);
            const url = `http://localhost:8080/admin/major/getall/${facultyId}?page=${currentPage}&size=${size}&name=${encodeURIComponent(search)}`;
            const response = await axios.get(url, getAuthConfig());
            const filteredMajors = response.data.content
                .filter(major => !major.isDelete)
                .map(major => ({
                    id: major.idMajor,
                    name: major.majorName,
                    nameEng: major.majorNameEng,
                    code: major.idMajor.toString()
                }));
            setMajors(filteredMajors);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Error in fetchMajors:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setError("Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
                setIsErrorModalOpen(true);
                setTimeout(() => {
                    localStorage.removeItem("jwtToken");
                    navigate("/login");
                }, 2000);
            } else if (error.response?.status === 403 || error.response?.data?.message?.includes("No majors found")) {
                setError("Khoa này chưa có chuyên ngành nào.");
                setIsErrorModalOpen(true);
                setMajors([]);
                setTotalPages(0);
            } else {
                setError(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
                setMajors([]);
                setTotalPages(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetchMajors = useCallback(
        debounce((search) => fetchMajors(search), 1000),
        [facultyId, page]
    );

    useEffect(() => {
        debouncedFetchMajors(searchTerm);
        return () => debouncedFetchMajors.cancel();
    }, [searchTerm, page, debouncedFetchMajors]);

    const addOrEditMajor = async () => {
        if (!newMajorName.trim()) {
            setError("Tên ngành không được để trống!");
            setIsErrorModalOpen(true);
            return;
        }
        if (!newMajorNameEng.trim()) {
            setError("Tên tiếng Anh của ngành không được để trống!");
            setIsErrorModalOpen(true);
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        const url = editMajor
            ? `http://localhost:8080/admin/major/update/${editMajor.id}`
            : `http://localhost:8080/admin/major/add`;

        try {
            const requestBody = editMajor
                ? {
                    idMajor: editMajor.id,
                    majorName: newMajorName,
                    facultyId: facultyId,
                    majorNameEng: newMajorNameEng
                }
                : {
                    majorName: newMajorName,
                    facultyId: facultyId,
                    majorNameEng: newMajorNameEng
                };

            await axios({
                method: editMajor ? "PUT" : "POST",
                url,
                data: requestBody,
                ...getAuthConfig(),
            });

            setNewMajorName("");
            setNewMajorNameEng("");
            setIsModalOpen(false);
            setIsSuccessModalOpen(true);
            setEditMajor(null);
            debouncedFetchMajors(searchTerm);

            setTimeout(() => setIsSuccessModalOpen(false), 2000);
        } catch (error) {
            console.error("Error in addOrEditMajor:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setError("Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
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

    const deleteMajor = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa ngành này?")) return;

        try {
            await axios.delete(`http://localhost:8080/admin/major/delete/${id}`, getAuthConfig());
            debouncedFetchMajors(searchTerm);
            setIsSuccessModalOpen(true);
            setTimeout(() => setIsSuccessModalOpen(false), 2000);
        } catch (error) {
            console.error("Error in deleteMajor:", {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setError("Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
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
            setPage(newPage);
        }
    };

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Quản lý Ngành học</h2>
            <div className="flex mb-4 space-x-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm ngành học..."
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <motion.button
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-green-600 hover:to-teal-600 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditMajor(null);
                        setNewMajorName("");
                        setNewMajorNameEng("");
                    }}
                    disabled={isLoading}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Thêm Ngành học
                </motion.button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Mã ngành</th>
                            <th className="p-3">Tên ngành</th>
                            <th className="p-3">Tên tiếng Anh</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {majors.length > 0 ? (
                                majors.map((major, index) => (
                                    <motion.tr
                                        key={major.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center">{index + 1 + page * size}</td>
                                        <td className="p-3 text-center font-semibold text-blue-600">{major.code}</td>
                                        <td className="p-3 text-center">{major.name}</td>
                                        <td className="p-3 text-center">{major.nameEng || '-'}</td>
                                        <td className="p-3 flex justify-center space-x-2">
                                            <button
                                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-yellow-600 hover:to-orange-600"
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setEditMajor(major);
                                                    setNewMajorName(major.name);
                                                    setNewMajorNameEng(major.nameEng || "");
                                                }}
                                                disabled={isLoading}
                                            >
                                                <PencilSquareIcon className="w-5 h-5 mr-1" /> Sửa
                                            </button>
                                            <button
                                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-red-600 hover:to-pink-600"
                                                onClick={() => deleteMajor(major.id)}
                                                disabled={isLoading}
                                            >
                                                <TrashIcon className="w-5 h-5 mr-1" /> Xóa
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
                                    <td colSpan="5" className="p-3 text-center text-gray-500">
                                        Không tìm thấy chuyên ngành
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0 || isLoading}
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2">
                        Trang {page + 1} / {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages - 1 || isLoading}
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* Modal thêm/sửa ngành học */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => !isLoading && setIsModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-xl font-bold mb-4">
                        {editMajor ? "Chỉnh sửa Ngành học" : "Thêm Ngành học Mới"}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Tên ngành học</label>
                        <input
                            type="text"
                            placeholder="Nhập tên ngành học"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                            value={newMajorName}
                            onChange={(e) => setNewMajorName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Tên tiếng Anh</label>
                        <input
                            type="text"
                            placeholder="Nhập tên tiếng Anh của ngành"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                            value={newMajorNameEng}
                            onChange={(e) => setNewMajorNameEng(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-300"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={addOrEditMajor}
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
                                editMajor ? "Cập Nhật" : "Thêm"
                            )}
                        </button>
                    </div>
                </motion.div>
            </Modal>

            {/* Modal thành công */}
            <Modal
                isOpen={isSuccessModalOpen}
                onRequestClose={() => setIsSuccessModalOpen(false)}
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
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
                        {editMajor ? "Cập nhật thành công!" : "Thêm ngành thành công!"}
                    </h2>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600"
                        >
                            Đóng
                        </button>
                    </div>
                </motion.div>
            </Modal>

            {/* Modal lỗi */}
            <Modal
                isOpen={isErrorModalOpen}
                onRequestClose={() => setIsErrorModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
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
                </motion.div>
            </Modal>
        </div>
    );
};

export default Department;