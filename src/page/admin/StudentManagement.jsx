import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import axios from "axios";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlusCircleIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

registerLocale("vi", vi);
Modal.setAppElement("#root");

export default function StudentManagement() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [search, setSearch] = useState("");
    const [facultyFilter, setFacultyFilter] = useState("");
    const [majorFilter, setMajorFilter] = useState("");
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        fullName: "",
        birthDay: "",
        facultyId: "",
        majorId: "",
        address: "",
        ethnicity: "",
        nationality: "",
        phoneNumber: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [majorofFaculty, setMajorofFaculty] = useState([]);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [lastOperation, setLastOperation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Check token on mount
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setErrorMessage("Không tìm thấy token. Vui lòng đăng nhập.");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }
    }, [navigate]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("jwtToken");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const fetchSearchResults = useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm.trim()) {
                if (majorFilter) {
                    fetchStudentsByMajor(majorFilter);
                } else {
                    fetchStudents();
                }
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/admin/student/search/name/${encodeURIComponent(searchTerm)}?page=${currentPage}&size=${itemsPerPage}`,
                    { headers: getAuthHeaders() }
                );
                setStudents(
                    response.data.content.map((student) => ({
                        id: student.id.toString(),
                        fullName: student.fullName || "",
                        birthDay: student.birthDay || "",
                        major: student.major || "Chưa xác định",
                        faculty: student.faculty || "Chưa xác định",
                        className: student.className || "",
                        address: student.address || "",
                        ethnicity: student.ethnicity || "",
                        nationality: student.nationality || "",
                        phoneNumber: student.phoneNumber || "",
                        email: student.email || "",
                    }))
                );
                setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
                setShowPagination(response.data.totalPages > 1);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sinh viên:", error);
                if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                    setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setErrorMessage(error.response?.data?.message || "Không thể tìm kiếm sinh viên.");
                }
                setStudents([]);
                setTotalPages(0);
                setShowPagination(false);
            } finally {
                setIsLoading(false);
            }
        }, 2000),
        [currentPage, majorFilter, navigate]
    );

    useEffect(() => {
        if (search.trim()) {
            fetchSearchResults(search);
        } else if (majorFilter) {
            fetchStudentsByMajor(majorFilter);
        } else {
            fetchStudents();
        }

        const fetchFaculties = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/faculty/all", {
                    headers: getAuthHeaders(),
                });
                setFaculties(response.data.content);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khoa:", error);
                if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                    setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setErrorMessage("Không thể lấy danh sách khoa.");
                }
            }
        };

        fetchFaculties();

        return () => {
            fetchSearchResults.cancel();
        };
    }, [currentPage, search, majorFilter, fetchSearchResults, navigate]);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/admin/student/all?page=${currentPage}&size=${itemsPerPage}`,
                { headers: getAuthHeaders() }
            );
            setStudents(
                response.data.content.map((student) => ({
                    id: student.id.toString(),
                    fullName: student.fullName || "",
                    birthDay: student.birthDay || "",
                    major: student.major || "Chưa xác định",
                    faculty: student.faculty || "Chưa xác định",
                    className: student.className || "",
                    address: student.address || "",
                    ethnicity: student.ethnicity || "",
                    nationality: student.nationality || "",
                    phoneNumber: student.phoneNumber || "",
                    email: student.email || "",
                }))
            );
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
            setShowPagination(response.data.totalPages > 1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sinh viên:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(error.response?.data?.message || "Không thể lấy danh sách sinh viên.");
            }
            setStudents([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudentById = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/admin/student/${id}`, {
                headers: getAuthHeaders(),
            });
            const student = response.data;

            const birthDayDate = student.birthDay ? parseDate(student.birthDay) : null;

            const studentData = {
                id: student.id.toString(),
                fullName: student.fullName || "",
                birthDay: birthDayDate ? formatDateToString(birthDayDate) : "",
                major: student.major || "Chưa xác định",
                majorId: student.majorId.toString(),
                faculty: student.faculty || "Chưa xác định",
                className: student.className || "",
                address: student.address || "",
                ethnicity: student.ethnicity || "",
                nationality: student.nationality || "",
                phoneNumber: student.phoneNumber || "",
                email: student.email || "",
                majorId: student.majorId || "",
                facultyId: student.facultyId || "",
            };

            setSelectedDate(birthDayDate);
            setNewStudent(studentData);
            return studentData;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sinh viên:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(error.response?.data?.message || "Không thể tải thông tin sinh viên.");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setNewStudent({
            fullName: "",
            birthDay: "",
            majorId: "",
            className: "",
            address: "",
            ethnicity: "",
            nationality: "",
            phoneNumber: "",
            email: "",
        });
        setSelectedDate(null);
        setShowAddModal(true);
    };

    const handleFacultyChange = async (facultyId) => {
        setNewStudent((prev) => ({ ...prev, facultyId, majorId: "" }));
        try {
            if (facultyId) {
                const response = await axios.get(`http://localhost:8080/admin/major/getall/${facultyId}`, {
                    headers: getAuthHeaders(),
                });
                setMajorofFaculty(response.data.content);
                if (response.data.content.length === 0) {
                    setErrorMessage("Khoa này chưa có chuyên ngành nào.");
                }
            } else {
                setMajorofFaculty([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách chuyên ngành:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else if (error.response?.status === 403 || error.response?.data?.message?.includes("No majors found")) {
                setErrorMessage("Khoa này chưa có chuyên ngành nào.");
                setMajorofFaculty([]);
            } else {
                setErrorMessage(error.response?.data?.message || "Không thể lấy danh sách chuyên ngành.");
                setMajorofFaculty([]);
            }
        }
    };

    const handleOpenViewModal = async (student) => {
        const studentData = await fetchStudentById(student.id);
        if (studentData) {
            setSelectedStudent(studentData);
            setNewStudent(studentData);
            setSelectedDate(studentData.birthDay ? parseDate(studentData.birthDay) : null);
            setShowViewModal(true);
        }
    };

    const handleOpenEditModal = async (student) => {
        const studentData = await fetchStudentById(student.id);
        if (studentData) {
            setSelectedStudent(studentData);
            setNewStudent(studentData);
            setSelectedDate(studentData.birthDay ? parseDate(studentData.birthDay) : null);
            setErrors({});
            Object.keys(studentData).forEach((key) => validateInput(key, studentData[key]));
            setShowEditModal(true);
        }
    };

    const handleSaveStudent = async () => {
        const newErrors = {};

        if (!newStudent.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống.";
        }

        if (!selectedDate) {
            newErrors.birthDay = "Vui lòng chọn ngày sinh.";
        }

        if (!newStudent.facultyId) {
            newErrors.facultyId = "Vui lòng chọn khoa.";
        }

        if (!newStudent.majorId) {
            newErrors.majorId = "Vui lòng chọn chuyên ngành.";
        }

        if (!newStudent.className.trim()) {
            newErrors.className = "Tên lớp không được để trống.";
        }

        if (!newStudent.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống.";
        }

        if (!newStudent.ethnicity.trim()) {
            newErrors.ethnicity = "Dân tộc không được để trống.";
        }

        if (!newStudent.nationality.trim()) {
            newErrors.nationality = "Quốc tịch không được để trống.";
        }

        if (!newStudent.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại không được để trống.";
        }

        if (!newStudent.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newStudent.email)) {
                newErrors.email = "Email không hợp lệ.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const studentToSave = {
                fullName: newStudent.fullName,
                birthDay: selectedDate ? formatDateToString(selectedDate) : "",
                majorId: parseInt(newStudent.majorId),
                className: newStudent.className,
                address: newStudent.address,
                ethnicity: newStudent.ethnicity || "Kinh",
                nationality: newStudent.nationality || "Việt Nam",
                phoneNumber: newStudent.phoneNumber,
                email: newStudent.email,
            };

            const response = await axios.post("http://localhost:8080/admin/student/add", studentToSave, {
                headers: getAuthHeaders(),
            });

            if (response.status === 200 || response.status === 201) {
                setShowAddModal(false);
                setLastOperation("add");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
                fetchStudents();
            }
        } catch (error) {
            console.error("Lỗi khi thêm sinh viên:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra khi thêm sinh viên.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMajorofFaculty = async (idFaculty) => {
        setFacultyFilter(idFaculty);
        try {
            if (idFaculty) {
                const response = await axios.get(`http://localhost:8080/admin/major/getall/${idFaculty}`, {
                    headers: getAuthHeaders(),
                });
                setMajorofFaculty(response.data.content);
                if (response.data.content.length === 0) {
                    setErrorMessage("Khoa này chưa có chuyên ngành nào.");
                }
            } else {
                setMajorofFaculty([]);
            }
        } catch (error) {
            console.error("Có lỗi khi lấy danh sách chuyên ngành của khoa!", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else if (error.response?.status === 403 || error.response?.data?.message?.includes("No majors found")) {
                setErrorMessage("Khoa này chưa có chuyên ngành nào.");
                setMajorofFaculty([]);
            } else {
                setErrorMessage(error.response?.data?.message || "Không thể lấy danh sách chuyên ngành.");
                setMajorofFaculty([]);
            }
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

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        setCurrentPage(0);
    };

    const handleUpdateStudent = async () => {
        const newErrors = {};

        if (!newStudent.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống.";
        } else if (newStudent.fullName.length > 50) {
            newErrors.fullName = "Họ và tên không được vượt quá 50 ký tự.";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(newStudent.fullName)) {
            newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
        }

        if (!selectedDate) {
            newErrors.birthDay = "Vui lòng chọn ngày sinh.";
        } else if (selectedDate > new Date()) {
            newErrors.birthDay = "Ngày sinh không được là ngày trong tương lai.";
        }

        if (!newStudent.className.trim()) {
            newErrors.className = "Tên lớp không được để trống.";
        } else if (newStudent.className.length > 20) {
            newErrors.className = "Tên lớp không được vượt quá 20 ký tự.";
        }

        if (!newStudent.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống.";
        } else if (newStudent.address.length > 100) {
            newErrors.address = "Địa chỉ không được vượt quá 100 ký tự.";
        }

        if (!newStudent.ethnicity.trim()) {
            newErrors.ethnicity = "Dân tộc không được để trống.";
        } else if (newStudent.ethnicity.length > 30) {
            newErrors.ethnicity = "Dân tộc không được vượt quá 30 ký tự.";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(newStudent.ethnicity)) {
            newErrors.ethnicity = "Dân tộc chỉ được chứa chữ cái và khoảng trắng.";
        }

        if (!newStudent.nationality.trim()) {
            newErrors.nationality = "Quốc tịch không được để trống.";
        } else if (newStudent.nationality.length > 30) {
            newErrors.nationality = "Quốc tịch không được vượt quá 30 ký tự.";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(newStudent.nationality)) {
            newErrors.nationality = "Quốc tịch chỉ được chứa chữ cái và khoảng trắng.";
        }

        if (!newStudent.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại không được để trống.";
        } else if (!/^[0-9]{10,11}$/.test(newStudent.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải chứa 10 hoặc 11 số.";
        }

        if (!newStudent.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (newStudent.email.length > 50) {
            newErrors.email = "Email không được vượt quá 50 ký tự.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const studentToUpdate = {
                id: selectedStudent.id,
                fullName: newStudent.fullName,
                birthDay: selectedDate ? formatDateToString(selectedDate) : "",
                majorId: selectedStudent.majorId,
                className: newStudent.className,
                address: newStudent.address,
                ethnicity: newStudent.ethnicity,
                nationality: newStudent.nationality,
                phoneNumber: newStudent.phoneNumber,
                email: newStudent.email,
            };

            const response = await axios.put(
                `http://localhost:8080/admin/student/update`,
                studentToUpdate,
                { headers: getAuthHeaders() }
            );

            if (response.status === 200 || response.status === 201) {
                setShowEditModal(false);
                setLastOperation("update");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
                setErrors({});
                if (search.trim()) {
                    fetchSearchResults(search);
                } else {
                    fetchStudents();
                }
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật sinh viên:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrors({
                    api: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sinh viên.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateInput = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case "fullName":
                if (!value.trim()) {
                    newErrors.fullName = "Họ và tên không được để trống.";
                } else if (value.length > 50) {
                    newErrors.fullName = "Họ và tên không được vượt quá 50 ký tự.";
                } else {
                    delete newErrors.fullName;
                }
                break;
            case "birthDay":
                if (!selectedDate) {
                    newErrors.birthDay = "Vui lòng chọn ngày sinh.";
                } else if (selectedDate > new Date()) {
                    newErrors.birthDay = "Ngày sinh không được là ngày trong tương lai.";
                } else {
                    delete newErrors.birthDay;
                }
                break;
            case "className":
                if (!value.trim()) {
                    newErrors.className = "Tên lớp không được để trống.";
                } else if (value.length > 20) {
                    newErrors.className = "Tên lớp không được vượt quá 20 ký tự.";
                } else {
                    delete newErrors.className;
                }
                break;
            case "address":
                if (!value.trim()) {
                    newErrors.address = "Địa chỉ không được để trống.";
                } else if (value.length > 100) {
                    newErrors.address = "Địa chỉ không được vượt quá 100 ký tự.";
                } else {
                    delete newErrors.address;
                }
                break;
            case "ethnicity":
                if (!value.trim()) {
                    newErrors.ethnicity = "Dân tộc không được để trống.";
                } else if (value.length > 30) {
                    newErrors.ethnicity = "Dân tộc không được vượt quá 30 ký tự.";
                } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
                    newErrors.ethnicity = "Dân tộc chỉ được chứa chữ cái và khoảng trắng.";
                } else {
                    delete newErrors.ethnicity;
                }
                break;
            case "nationality":
                if (!value.trim()) {
                    newErrors.nationality = "Quốc tịch không được để trống.";
                } else if (value.length > 30) {
                    newErrors.nationality = "Quốc tịch không được vượt quá 30 ký tự.";
                } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
                    newErrors.nationality = "Quốc tịch chỉ được chứa chữ cái và khoảng trắng.";
                } else {
                    delete newErrors.nationality;
                }
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    newErrors.phoneNumber = "Số điện thoại không được để trống.";
                } else if (!/^[0-9]{10,11}$/.test(value)) {
                    newErrors.phoneNumber = "Số điện thoại phải chứa 10 hoặc 11 số.";
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            case "email":
                if (!value.trim()) {
                    newErrors.email = "Email không được để trống.";
                } else if (value.length > 50) {
                    newErrors.email = "Email không được vượt quá 50 ký tự.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = "Email không hợp lệ.";
                } else {
                    delete newErrors.email;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return new Date(dateString);
        }

        const separator = dateString.includes('/') ? '/' : '-';
        const parts = dateString.split(separator);
        if (parts.length !== 3) return null;

        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day);

        return isNaN(date) ? null : date;
    };

    const formatDateToString = (date) => {
        if (!date || isNaN(date)) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        if (!date || isNaN(date)) return '';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/admin/student/${id}`, {
                headers: getAuthHeaders(),
            });
            if (response.status === 200) {
                setLastOperation("delete");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
                if (search.trim()) {
                    fetchSearchResults(search);
                } else if (majorFilter) {
                    fetchStudentsByMajor(majorFilter);
                } else {
                    fetchStudents();
                }
            }
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setLastOperation("delete");
                setErrorMessage(error.response?.data?.message || "Xóa sinh viên không thành công!");
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudentsByMajor = async (majorId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/admin/student/search/major/${majorId}?page=${currentPage}&size=${itemsPerPage}`,
                { headers: getAuthHeaders() }
            );
            setStudents(
                response.data.content.map((student) => ({
                    id: student.id.toString(),
                    fullName: student.fullName || "",
                    birthDay: student.birthDay || "",
                    major: student.major || "Chưa xác định",
                    faculty: student.faculty || "Chưa xác định",
                    className: student.className || "",
                    address: student.address || "",
                    ethnicity: student.ethnicity || "",
                    nationality: student.nationality || "",
                    phoneNumber: student.phoneNumber || "",
                    email: student.email || "",
                }))
            );
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
            setShowPagination(response.data.totalPages > 1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sinh viên theo chuyên ngành:", error);
            if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message?.includes("Access Denied"))) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(error.response?.data?.message || "Không thể lấy danh sách sinh viên theo chuyên ngành.");
            }
            setStudents([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Quản lý Sinh Viên</h1>

            {/* Thanh tìm kiếm */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc tên sinh viên..."
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={handleSearchChange}
                    disabled={isLoading}
                />
            </div>

            <div className="flex gap-4 mb-6">
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={facultyFilter}
                    onChange={(e) => handleLoadMajorofFaculty(e.target.value)}
                >
                    <option value="">Tất cả khoa</option>
                    {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                            {faculty.facultyName}
                        </option>
                    ))}
                </select>
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={majorFilter}
                    onChange={(e) => setMajorFilter(e.target.value)}
                >
                    <option value="">Chuyên ngành</option>
                    {majorofFaculty.length > 0 &&
                        majorofFaculty.map((major) => (
                            <option key={major.idMajor} value={major.idMajor}>
                                {major.majorName}
                            </option>
                        ))}
                </select>
                <motion.button
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-green-600 hover:to-teal-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenAddModal}
                    disabled={isLoading}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Thêm Sinh Viên
                </motion.button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">Mã SV</th>
                            <th className="p-3">Họ và tên</th>
                            <th className="p-3">Khoa</th>
                            <th className="p-3">Ngành</th>
                            <th className="p-3">Lớp</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="6" className="p-3 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : students.length > 0 ? (
                                students.map((student) => (
                                    <motion.tr
                                        key={student.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center font-semibold text-blue-600">{student.id}</td>
                                        <td className="p-3 text-center">{student.fullName}</td>
                                        <td className="p-3 text-center">{student.faculty || "Chưa xác định"}</td>
                                        <td className="p-3 text-center">{student.major || "Chưa xác định"}</td>
                                        <td className="p-3 text-center">{student.className}</td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <motion.button
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-blue-600 hover:to-indigo-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenViewModal(student)}
                                            >
                                                <EyeIcon className="w-5 h-5 mr-1" /> Xem
                                            </motion.button>
                                            <motion.button
                                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-yellow-600 hover:to-orange-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenEditModal(student)}
                                            >
                                                <PencilSquareIcon className="w-5 h-5 mr-1" /> Sửa
                                            </motion.button>
                                            <motion.button
                                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-red-600 hover:to-pink-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDeleteStudent(student.id)}
                                                disabled={isLoading}
                                            >
                                                <TrashIcon className="w-5 h-5 mr-1" /> Xóa
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="6" className="p-3 text-center text-gray-500">
                                        Không tìm thấy sinh viên
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
                        className="p-2 bg-gradient-to-r from-gray-7
                        00 to-gray-900 text-white rounded-full disabled:from-gray-300 disabled:to-gray-400 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </motion.button>
                </div>
            )}

            {/* Modal Thêm Sinh Viên */}
            <Modal
                isOpen={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
                className="bg-white p-6 rounded-lg w-[70%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Thêm Sinh Viên</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Họ và tên</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.fullName}
                            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Ngày sinh</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                setNewStudent({ ...newStudent, birthDay: date ? formatDateToString(date) : "" });
                            }}
                            dateFormat="dd/MM/yyyy"
                            locale="vi"
                            placeholderText="Chọn ngày (dd/MM/yyyy)"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        {errors.birthDay && <p className="text-red-500 text-sm mt-1">{errors.birthDay}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Khoa</label>
                        <select
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.facultyId}
                            onChange={(e) => handleFacultyChange(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Chọn khoa</option>
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>
                                    {faculty.facultyName}
                                </option>
                            ))}
                        </select>
                        {errors.facultyId && <p className="text-red-500 text-sm mt-1">{errors.facultyId}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Chuyên ngành</label>
                        <select
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.majorId}
                            onChange={(e) => setNewStudent({ ...newStudent, majorId: e.target.value })}
                            disabled={isLoading || !newStudent.facultyId}
                        >
                            <option value="">Chọn chuyên ngành</option>
                            {majorofFaculty.map((major) => (
                                <option key={major.idMajor} value={major.idMajor}>
                                    {major.majorName}
                                </option>
                            ))}
                        </select>
                        {errors.majorId && <p className="text-red-500 text-sm mt-1">{errors.majorId}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Tên lớp</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.className}
                            onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Địa chỉ</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.address}
                            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Dân tộc</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.ethnicity}
                            onChange={(e) => setNewStudent({ ...newStudent, ethnicity: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.ethnicity && <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quốc tịch</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.nationality}
                            onChange={(e) => setNewStudent({ ...newStudent, nationality: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Số điện thoại</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.phoneNumber}
                            onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-teal-600"
                            }`}
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        onClick={handleSaveStudent}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Lưu"}
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Xem Sinh Viên */}
            <Modal
                isOpen={showViewModal}
                onRequestClose={() => setShowViewModal(false)}
                className="bg-white p-6 rounded-lg w-[70%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Xem Thông Tin Sinh Viên</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Họ và tên</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.fullName}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Ngày sinh</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            type="text"
                            value={formatDisplayDate(newStudent.birthDay)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Khoa</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.faculty}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Chuyên ngành</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.major}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Tên lớp</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.className}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Địa chỉ</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.address}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Dân tộc</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.ethnicity}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quốc tịch</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.nationality}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Số điện thoại</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.phoneNumber}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.email}
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex justify-end p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowViewModal(false)}
                    >
                        Đóng
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Sửa Sinh Viên */}
            <Modal
                isOpen={showEditModal}
                onRequestClose={() => setShowEditModal(false)}
                className="bg-white p-6 rounded-lg w-[70%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Sửa Sinh Viên</h2>
                </div>
                {errors.api && <p className="text-red-500 text-sm mt-2 mx-4">{errors.api}</p>}
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Họ và tên</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.fullName ? "border-red-500" : ""
                                }`}
                            value={newStudent.fullName}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, fullName: e.target.value });
                                validateInput("fullName", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Ngày sinh</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                setNewStudent({ ...newStudent, birthDay: date ? formatDateToString(date) : "" });
                                validateInput("birthDay", date ? formatDateToString(date) : "");
                            }}
                            dateFormat="dd/MM/yyyy"
                            locale="vi"
                            placeholderText="Chọn ngày (dd/MM/yyyy)"
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.birthDay ? "border-red-500" : ""
                                }`}
                            disabled={isLoading}
                        />
                        {errors.birthDay && <p className="text-red-500 text-sm mt-1">{errors.birthDay}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Khoa</label>
                        <input
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.faculty}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Chuyên ngành</label>
                        <select
                            className="border p-2 w-full rounded-lg bg-gray-100"
                            value={newStudent.majorId}
                            onChange={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    majorId: e.target.value,
                                    majorName: majors.find((m) => m.id === e.target.value)?.name || "",
                                }))
                            }
                        >
                            {majors.map((major) => (
                                <option key={major.id} value={major.id}>
                                    {major.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Tên lớp</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.className ? "border-red-500" : ""
                                }`}
                            value={newStudent.className}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, className: e.target.value });
                                validateInput("className", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Địa chỉ</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.address ? "border-red-500" : ""
                                }`}
                            value={newStudent.address}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, address: e.target.value });
                                validateInput("address", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Dân tộc</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.ethnicity ? "border-red-500" : ""
                                }`}
                            value={newStudent.ethnicity}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, ethnicity: e.target.value });
                                validateInput("ethnicity", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.ethnicity && <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quốc tịch</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.nationality ? "border-red-500" : ""
                                }`}
                            value={newStudent.nationality}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, nationality: e.target.value });
                                validateInput("nationality", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Số điện thoại</label>
                        <input
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.phoneNumber ? "border-red-500" : ""
                                }`}
                            value={newStudent.phoneNumber}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, phoneNumber: e.target.value });
                                validateInput("phoneNumber", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.email ? "border-red-500" : ""
                                }`}
                            value={newStudent.email}
                            onChange={(e) => {
                                setNewStudent({ ...newStudent, email: e.target.value });
                                validateInput("email", e.target.value);
                            }}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowEditModal(false);
                            setErrors({});
                        }}
                        disabled={isLoading}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md ${isLoading || Object.keys(errors).length > 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:from-green-600 hover:to-teal-600"
                            }`}
                        whileHover={{ scale: isLoading || Object.keys(errors).length > 0 ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading || Object.keys(errors).length > 0 ? 1 : 0.95 }}
                        onClick={handleUpdateStudent}
                        disabled={isLoading || Object.keys(errors).length > 0}
                    >
                        {isLoading ? "Đang xử lý..." : "Lưu"}
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Thông Báo */}
            <Modal
                isOpen={isSuccessModalOpen || !!errorMessage}
                onRequestClose={() => {
                    setIsSuccessModalOpen(false);
                    setErrorMessage("");
                }}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className={`text-xl font-bold ${errorMessage ? "text-red-600" : "text-green-600"} mb-4 text-center`}>
                        {errorMessage
                            ? errorMessage
                            : lastOperation === "update"
                                ? "Cập nhật sinh viên thành công!"
                                : lastOperation === "delete"
                                    ? "Xóa sinh viên thành công!"
                                    : "Thêm sinh viên thành công!"}
                    </h2>
                    <div className="flex justify-center">
                        <motion.button
                            className={`bg-gradient-to-r ${errorMessage ? "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600" : "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                } text-white px-4 py-2 rounded-lg`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                setErrorMessage("");
                            }}
                        >
                            Đóng
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
} 