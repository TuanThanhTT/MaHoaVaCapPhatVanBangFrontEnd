import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/solid";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

const CreateCertificate = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [filters, setFilters] = useState({ facultyName: "", majorName: "", keyword: "" });
    const [inputKeyword, setInputKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [formData, setFormData] = useState({ gpa: "", degreeType: "Kỹ sư" });
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const hasFilters = filters.facultyName || filters.majorName || filters.keyword;
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);

    const fetchFaculties = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            const response = await axios.get("http://localhost:8080/admin/faculty/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setFaculties(response.data.content || []);
        } catch (error) {
            console.error("Error fetching faculties:", error);
            setNotification({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách khoa từ API.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMajors = async (facultyId) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            const response = await axios.get(`http://localhost:8080/admin/major/getall/${facultyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const majorsData = response.data.content || [];
            setMajors(majorsData);
            if (majorsData.length === 0) {
                setNotification({ message: "Khoa này không có chuyên ngành.", type: "error" });
            } else {
                setNotification({ message: "", type: "" });
            }
        } catch (error) {
            console.error("Error fetching majors:", error);
            setNotification({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách chuyên ngành từ API.",
                type: "error",
            });
            setMajors([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async (pageNum) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            let response;
            if (filters.keyword && filters.keyword.length >= 2) {
                response = await axios.get(
                    `http://localhost:8080/admin/student/studentDegree/${encodeURIComponent(filters.keyword)}?page=${pageNum}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else if (filters.majorName) {
                const selectedMajor = majors.find((m) => m.majorName === filters.majorName);
                const majorId = selectedMajor?.idMajor;
                if (majorId) {
                    response = await axios.get(
                        `http://localhost:8080/admin/student/studentDegree/major/${majorId}?page=${pageNum}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                } else {
                    setStudents([]);
                    setTotalPages(0);
                    setNotification({ message: "Không tìm thấy chuyên ngành.", type: "error" });
                    return;
                }
            } else if (filters.facultyName) {
                const selectedFaculty = faculties.find((f) => f.facultyName === filters.facultyName);
                const facultyId = selectedFaculty?.id;
                if (facultyId) {
                    response = await axios.get(
                        `http://localhost:8080/admin/student/studentDegree/faculty/${facultyId}?page=${pageNum}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                } else {
                    setStudents([]);
                    setTotalPages(0);
                    setNotification({ message: "Không tìm thấy khoa.", type: "error" });
                    return;
                }
            } else {
                response = await axios.get(`http://localhost:8080/admin/student/studentdegree?page=${pageNum}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            setStudents(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching students:", error);
            setNotification({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách sinh viên từ API.",
                type: "error",
            });
            setStudents([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDegreeInfo = async (studentId) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            const response = await axios.get(`http://localhost:8080/admin/degree/info/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching degree info:", error);
            setNotification({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy thông tin văn bằng từ API.",
                type: "error",
            });
            return null;
        }
    };

    const handleDeleteDegree = async (student) => {
        if (window.confirm(`Bạn có chắc muốn xóa văn bằng của sinh viên ${student.fullName}?`)) {
            setIsLoading(true);
            setNotification({ message: "", type: "" });
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }
                const response = await axios.delete(`http://localhost:8080/admin/degree/delete/${student.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 204) {
                    openSuccessModal(`Đã xóa văn bằng của sinh viên ${student.fullName}!`);
                    await fetchStudents(page);
                } else {
                    setNotification({
                        message: `Xóa văn bằng thất bại với mã trạng thái: ${response.status}`,
                        type: "error",
                    });
                }
            } catch (error) {
                console.error("Error deleting degree:", error.response || error);
                setNotification({
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Không thể xóa văn bằng.",
                    type: "error",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFacultyChange = (facultyName) => {
        setFilters({ ...filters, facultyName, majorName: "", keyword: "" });
        setInputKeyword("");
        setNotification({ message: "", type: "" });
        setPage(0);
        if (facultyName) {
            const selectedFaculty = faculties.find((f) => f.facultyName === facultyName);
            if (selectedFaculty) {
                fetchMajors(selectedFaculty.id);
            } else {
                setMajors([]);
            }
        } else {
            setMajors([]);
        }
    };

    const handleMajorChange = (majorName) => {
        setFilters({ ...filters, majorName, keyword: "" });
        setInputKeyword("");
        setNotification({ message: "", type: "" });
        setPage(0);
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleKeywordChange = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, facultyName: "", majorName: "", keyword: value }));
        }, 300),
        []
    );

    const handleInputChange = (value) => {
        setInputKeyword(value);
        handleKeywordChange(value);
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    useEffect(() => {
        fetchStudents(page);
    }, [page, filters.facultyName, filters.majorName, filters.keyword]);

    const handleCheckboxChange = (id) => {
        setSelectedStudents((prev) => {
            const newSelection = new Set(prev);
            newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
            return newSelection;
        });
    };

    const openModal = async (student, isUpdate = false) => {
        setCurrentStudent(student);
        if (isUpdate) {
            const degreeInfo = await fetchDegreeInfo(student.id);
            if (degreeInfo) {
                setFormData({
                    gpa: degreeInfo.gpa || "",
                    degreeType: degreeInfo.degreeClassification || "Kỹ sư",
                });
            } else {
                setFormData({
                    gpa: "",
                    degreeType: "Kỹ sư",
                });
            }
        } else {
            setFormData({
                gpa: "",
                degreeType: "Kỹ sư",
            });
        }
        setNotification({ message: "", type: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStudent(null);
        setFormData({ gpa: "", degreeType: "Kỹ sư" });
        setNotification({ message: "", type: "" });
    };

    const handleSubmit = async () => {
        if (!formData.gpa || isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4) {
            setNotification({ message: "Vui lòng nhập GPA hợp lệ (0-4).", type: "error" });
            return;
        }
        setIsLoading(true);
        setNotification({ message: "", type: "" });
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }
            const payload = {
                degreeId: "",
                studentId: currentStudent.id.toString(),
                degreeStatusId: "",
                degreeClassification: formData.degreeType,
                gpa: parseFloat(formData.gpa),
                LocalDate: "",
                degreeType: "",
            };
            if (currentStudent.hasDegree) {
                const response = await axios.put(`http://localhost:8080/admin/degree/update`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200) {
                    openSuccessModal(`Đã cập nhật văn bằng cho sinh viên ${currentStudent.fullName}!`);
                    closeModal();
                    await fetchStudents(page);
                } else {
                    setNotification({
                        message: `Cập nhật thất bại với mã trạng thái: ${response.status}`,
                        type: "error",
                    });
                }
            } else {
                const response = await axios.post(`http://localhost:8080/admin/degree/add`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200 || response.status === 201) {
                    openSuccessModal(
                        `Đã tạo văn bằng cho sinh viên ${currentStudent.fullName}! Mã văn bằng: ${response.data.degreeId || "N/A"}`
                    );
                    closeModal();
                    await fetchStudents(page);
                } else {
                    setNotification({
                        message: `Tạo văn bằng thất bại với mã trạng thái: ${response.status}`,
                        type: "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error submitting degree:", error.response || error);
            setNotification({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể tạo văn bằng.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const createBatchCertificates = async () => {
        if (window.confirm(`Bạn có chắc muốn tạo văn bằng cho ${selectedStudents.size} sinh viên?`)) {
            setIsLoading(true);
            setNotification({ message: "", type: "" });
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }
                // Giả lập tạo văn bằng hàng loạt (cần endpoint API thực tế)
                openSuccessModal(`Đã tạo văn bằng cho ${selectedStudents.size} sinh viên!`);
                setSelectedStudents(new Set());
                await fetchStudents(page);
            } catch (error) {
                console.error("Error in batch creation:", error);
                setNotification({
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Có lỗi xảy ra khi tạo văn bằng hàng loạt.",
                    type: "error",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const resetFilters = () => {
        setFilters({ facultyName: "", majorName: "", keyword: "" });
        setInputKeyword("");
        setMajors([]);
        setSelectedStudents(new Set());
        setNotification({ message: "", type: "" });
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const getPageNumbers = () => {
        if (totalPages === 0) return [];
        const visiblePages = 5;
        const half = Math.floor(visiblePages / 2);
        let start = Math.max(page - half, 0);
        let end = Math.min(start + visiblePages, totalPages);
        if (end - start < visiblePages) {
            start = Math.max(end - visiblePages, 0);
        }
        return Array.from({ length: end - start }, (_, i) => start + i);
    };

    const openSuccessModal = (message) => {
        setSuccessMessage(message);
        setIsSuccessModalOpen(true);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setSuccessMessage("");
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Tạo Văn Bằng</h1>
            {notification.message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 mb-4 rounded-lg shadow-md ${notification.type === "success"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                        }`}
                >
                    {notification.message}
                </motion.div>
            )}
            {/* Thanh tìm kiếm và lọc */}
            <div className="flex gap-4 mb-6 relative">
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.facultyName}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Tất cả khoa</option>
                    {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.facultyName}>
                            {faculty.facultyName}
                        </option>
                    ))}
                </select>
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.majorName}
                    onChange={(e) => handleMajorChange(e.target.value)}
                    disabled={isLoading || !filters.facultyName}
                >
                    <option value="">Tất cả chuyên ngành</option>
                    {majors.map((major) => (
                        <option key={major.idMajor} value={major.majorName}>
                            {major.majorName}
                        </option>
                    ))}
                </select>
                <div className="w-1/3 relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sinh viên..."
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        value={inputKeyword}
                        onChange={(e) => handleInputChange(e.target.value)}
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg
                                className="animate-spin h-5 w-5 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                ></path>
                            </svg>
                        </div>
                    )}
                </div>
                {hasFilters && (
                    <motion.button
                        className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-gray-500 hover:to-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetFilters}
                        disabled={isLoading}
                    >
                        Làm Mới
                    </motion.button>
                )}
            </div>

            {/* Nút tạo văn bằng hàng loạt */}
            {selectedStudents.size > 0 && (
                <div className="mb-6">
                    <motion.button
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-green-600 hover:to-teal-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={createBatchCertificates}
                        disabled={isLoading}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                            <PlusCircleIcon />
                        </svg>
                        Tạo Văn Bằng Hàng Loạt ({selectedStudents.size})
                    </motion.button>
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3 text-center">Chọn</th>
                            <th className="p-3 text-center">Tên</th>
                            <th className="p-3 text-center">Khoa</th>
                            <th className="p-3 text-center">Chuyên Ngành</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="5" className="p-3 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : students.length > 0 ? (
                                students.map((sv) => (
                                    <motion.tr
                                        key={sv.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(sv.id)}
                                                checked={selectedStudents.has(sv.id)}
                                                disabled={isLoading}
                                            />
                                        </td>
                                        <td className="p-3 text-center">{sv.fullName}</td>
                                        <td className="p-3 text-center">{sv.facultyName}</td>
                                        <td className="p-3 text-center">{sv.majorName}</td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <motion.button
                                                className={`bg-gradient-to-r ${sv.hasDegree
                                                    ? "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                                    : "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                                    } text-white px-3 py-1 rounded-lg flex items-center shadow`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => openModal(sv, sv.hasDegree)}
                                                disabled={isLoading}
                                            >
                                                {sv.hasDegree ? "Cập Nhật" : "Tạo Văn Bằng"}
                                            </motion.button>
                                            {sv.hasDegree && (
                                                <motion.button
                                                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1 rounded-lg flex items-center shadow"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteDegree(sv)}
                                                    disabled={isLoading}
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1">
                                                        <TrashIcon />
                                                    </svg>
                                                    Xóa
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    key="no-data"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="5" className="p-3 text-center text-gray-500">
                                        Không tìm thấy sinh viên
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <motion.button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0 || isLoading}
                        className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full disabled:from-gray-300 disabled:to-gray-400 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <ChevronLeftIcon />
                        </svg>
                    </motion.button>
                    <div className="flex space-x-1">
                        {getPageNumbers().map((p) => (
                            <motion.button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`px-4 py-2 rounded-full shadow-md text-sm font-semibold ${page === p
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isLoading}
                            >
                                {p + 1}
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1 || isLoading}
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

            {/* Modal nhập thông tin văn bằng */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="bg-white p-6 rounded-lg w-[50%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div
                    className={`bg-gradient-to-r ${currentStudent?.hasDegree
                        ? "from-yellow-500 to-orange-500"
                        : "from-blue-500 to-indigo-500"
                        } text-white p-3 rounded-t-lg`}
                >
                    <h2 className="text-xl font-bold">
                        {currentStudent?.hasDegree ? "Cập Nhật Văn Bằng" : "Tạo Văn Bằng"}
                    </h2>
                </div>
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">GPA</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập GPA (0-4)"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700">Loại Văn Bằng</label>
                        <select
                            value={formData.degreeType}
                            onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            <option value="Kỹ sư">Kỹ sư</option>
                            <option value="Cử nhân">Cử nhân</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={closeModal}
                        disabled={isLoading}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-teal-600"
                            }`}
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : currentStudent?.hasDegree ? "Cập Nhật" : "Tạo"}
                    </motion.button>
                </div>
            </Modal>

            {/* Modal thông báo thành công */}
            <Modal
                isOpen={isSuccessModalOpen}
                onRequestClose={closeSuccessModal}
                className="bg-white p-6 rounded-lg w-[40%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Thành Công</h2>
                </div>
                <div className="p-4">
                    <p className="text-gray-800">{successMessage}</p>
                </div>
                <div className="flex justify-end p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={closeSuccessModal}
                    >
                        Đóng
                    </motion.button>
                </div>
            </Modal>
        </div>
    );
};

export default CreateCertificate;