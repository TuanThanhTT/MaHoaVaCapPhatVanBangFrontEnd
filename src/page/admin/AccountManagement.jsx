import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { LockOpenIcon, LockClosedIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function AccountManagement() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [lastOperation, setLastOperation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const roleOptions = [
        { id: "", name: "Tất cả" },
        { id: 1, name: "Administrator" },
        { id: 2, name: "Admin" },
        { id: 3, name: "Student" },
    ];
    const roleAddModal = [
        { id: 1, name: "Administrator" },
        { id: 2, name: "Admin" },
    ];
    const [newAccount, setNewAccount] = useState({
        email: "",
        roleId: "",
    });
    const [errors, setErrors] = useState({});

    // Check token and user role on mount
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setErrorMessage("Không tìm thấy token. Vui lòng đăng nhập.");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("JWT Payload:", payload);
            const role = payload.role || payload.authorities?.[0]?.authority || payload.scope || payload.roleId || payload.roles?.[0];
            const roleId =
                payload.roleId ||
                (role === "ROLE_ADMINISTRATOR" ? 1 :
                    role === "ROLE_ADMIN" ? 2 :
                        role === "ROLE_STUDENT" ? 3 :
                            typeof role === "number" ? role : null);
            console.log("Extracted Role:", role, "Role ID:", roleId);
            if (!roleId) {
                console.warn("No valid role found in JWT payload");
                setErrorMessage("Không thể xác định quyền người dùng. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
                return;
            }
            setCurrentUserRole(roleId);
        } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
            setErrorMessage("Token không hợp lệ. Vui lòng đăng nhập lại.");
            setTimeout(() => navigate("/login"), 2000);
        }
    }, [navigate]);

    const getAuthHeaders = (isTextPlain = false) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.error("No token found in localStorage");
        }
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": isTextPlain ? "text/plain" : "application/json",
        };
    };

    const fetchSearchResults = useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm.trim()) {
                if (roleFilter) {
                    fetchAccountsByRole(roleFilter);
                } else {
                    fetchAccounts();
                }
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/admin/user/search/name/${encodeURIComponent(searchTerm)}?page=${currentPage}&size=${itemsPerPage}`,
                    { headers: getAuthHeaders() }
                );
                console.log("Search API Response:", response.data);
                const mappedAccounts = response.data.content.map((account) => ({
                    id: account.id.toString(),
                    username: account.userName || "",
                    email: account.email || "",
                    role: roleOptions.find((r) => r.id === (account.roleId || account.role))?.name || account.roleName || "Chưa xác định",
                    isLocked: account.isClocked || false,
                    roleId: account.roleId || account.role || (account.roleName === "Student" ? 3 : account.roleName === "Admin" ? 2 : account.roleName === "Administrator" ? 1 : null),
                }));
                console.log("Mapped Search Accounts:", mappedAccounts);
                setAccounts(mappedAccounts);
                setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
                setShowPagination(response.data.totalPages > 1);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm tài khoản:", error);
                if (error.response?.status === 403) {
                    setIsErrorModalOpen(true);
                } else if (error.response?.status === 401) {
                    setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setErrorMessage(
                        error.response?.data?.message || "Không thể tìm kiếm tài khoản. Vui lòng kiểm tra kết nối."
                    );
                }
                setAccounts([]);
                setTotalPages(0);
                setShowPagination(false);
            } finally {
                setIsLoading(false);
            }
        }, 2000),
        [currentPage, roleFilter, navigate]
    );

    useEffect(() => {
        if (search.trim()) {
            fetchSearchResults(search);
        } else if (roleFilter) {
            fetchAccountsByRole(roleFilter);
        } else {
            fetchAccounts();
        }

        return () => {
            fetchSearchResults.cancel();
        };
    }, [currentPage, search, roleFilter, fetchSearchResults]);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/admin/user/all?page=${currentPage}&size=${itemsPerPage}`,
                { headers: getAuthHeaders() }
            );
            console.log("All Accounts API Response:", response.data);
            const mappedAccounts = response.data.content.map((account) => ({
                id: account.id.toString(),
                username: account.userName || "",
                email: account.email || "",
                role: roleOptions.find((r) => r.id === (account.roleId || account.role))?.name || account.roleName || "Chưa xác định",
                isLocked: account.isClocked || false,
                roleId: account.roleId || account.role || (account.roleName === "Student" ? 3 : account.roleName === "Admin" ? 2 : account.roleName === "Administrator" ? 1 : null),
            }));
            console.log("Mapped All Accounts:", mappedAccounts);
            setAccounts(mappedAccounts);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
            setShowPagination(response.data.totalPages > 1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài khoản:", error);
            if (error.response?.status === 403) {
                setIsErrorModalOpen(true);
            } else if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Không thể lấy danh sách tài khoản. Vui lòng kiểm tra kết nối."
                );
            }
            setAccounts([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAccountsByRole = async (roleId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/admin/user/search/role/${roleId}?page=${currentPage}&size=${itemsPerPage}`,
                { headers: getAuthHeaders() }
            );
            console.log("Role Accounts API Response:", response.data);
            const mappedAccounts = response.data.content.map((account) => ({
                id: account.id.toString(),
                username: account.userName || "",
                email: account.email || "",
                role: roleOptions.find((r) => r.id === (account.roleId || account.role))?.name || account.roleName || "Chưa xác định",
                isLocked: account.isClocked || false,
                roleId: account.roleId || account.role || (account.roleName === "Student" ? 3 : account.roleName === "Admin" ? 2 : account.roleName === "Administrator" ? 1 : null),
            }));
            console.log("Mapped Role Accounts:", mappedAccounts);
            setAccounts(mappedAccounts);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
            setShowPagination(response.data.totalPages > 1);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài khoản theo loại:", error);
            if (error.response?.status === 403) {
                setIsErrorModalOpen(true);
            } else if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Không thể lấy danh sách tài khoản theo loại. Vui lòng kiểm tra kết nối."
                );
            }
            setAccounts([]);
            setTotalPages(0);
            setShowPagination(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLockAccount = async (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn khóa tài khoản này?`)) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/admin/user/delete/${id}`, {
                headers: getAuthHeaders(),
            });
            if (response.data === true) {
                setAccounts((prevAccounts) =>
                    prevAccounts.map((account) =>
                        account.id === id ? { ...account, isLocked: true } : account
                    )
                );
                setLastOperation("lock");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
            } else {
                setIsErrorModalOpen(true); // Giả định false là do thiếu quyền
            }
        } catch (error) {
            console.error("Lỗi khi khóa tài khoản:", error);
            if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setLastOperation("lock");
                setErrorMessage(
                    error.response?.data?.message || "Không thể khóa tài khoản. Vui lòng kiểm tra quyền hoặc kết nối."
                );
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockAccount = async (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản này?`)) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:8080/admin/user/unlock/${id}`, null, {
                headers: getAuthHeaders(),
            });
            if (response.data === true) {
                setAccounts((prevAccounts) =>
                    prevAccounts.map((account) =>
                        account.id === id ? { ...account, isLocked: false } : account
                    )
                );
                setLastOperation("unlock");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
            } else {
                throw new Error("Mở khóa không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi mở khóa tài khoản:", error);
            if (error.response?.status === 403) {
                setIsErrorModalOpen(true);
            } else if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setLastOperation("unlock");
                setErrorMessage(
                    error.response?.data?.message ||
                    "Không thể mở khóa tài khoản. Vui lòng kiểm tra quyền hoặc kết nối."
                );
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này?`)) {
            return;
        }
        setIsLoading(true);
        try {
            const account = accounts.find((acc) => acc.id === id);
            if (!account || !account.username) {
                throw new Error("Tên tài khoản không hợp lệ hoặc không tìm thấy.");
            }
            const headers = getAuthHeaders(true);
            console.log("Reset Password Request: userName=", account.username, "Headers=", headers);
            const response = await axios.post(
                `http://localhost:8080/admin/user/account/reset`,
                account.username,
                { headers }
            );
            console.log("Reset Password Response:", response.data, "Status:", response.status);
            if (response.data === true || response.data?.success === true) {
                setLastOperation("reset");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
            } else {
                throw new Error(
                    response.data?.message || "Đặt lại mật khẩu không thành công: Phản hồi không hợp lệ"
                );
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", {
                message: error.message,
                code: error.code,
                response: error.response,
                request: error.request,
            });
            if (error.response?.status === 403) {
                setIsErrorModalOpen(true);
            } else if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else if (error.response) {
                setLastOperation("reset");
                setErrorMessage(
                    error.response.data?.message ||
                    `Không thể đặt lại mật khẩu. Mã lỗi: ${error.response.status}`
                );
                setIsSuccessModalOpen(true);
            } else if (error.request) {
                setLastOperation("reset");
                setErrorMessage(
                    "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc cấu hình máy chủ."
                );
                setIsSuccessModalOpen(true);
            } else {
                setLastOperation("reset");
                setErrorMessage(`Lỗi: ${error.message}`);
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setNewAccount({
            email: "",
            roleId: "",
        });
        setErrors({});
        setShowAddModal(true);
    };

    const getRoleStyles = (role) => {
        switch (role) {
            case "Administrator":
                return "text-blue-700";
            case "Admin":
                return "text-green-700";
            case "Student":
                return "text-yellow-700";
            default:
                return "text-gray-700";
        }
    };

    const handleSaveAccount = async () => {
        const newErrors = {};

        if (!newAccount.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAccount.email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        if (!newAccount.roleId) {
            newErrors.roleId = "Vui lòng chọn quyền.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const accountToSave = {
                userId: "",
                userName: "",
                passWord: "",
                email: newAccount.email,
                lastLogin: "",
                role: newAccount.roleId,
            };

            const response = await axios.post(
                "http://localhost:8080/admin/user/addUserAdmin",
                accountToSave,
                { headers: getAuthHeaders() }
            );

            if (response.status === 200 || response.status === 201) {
                setShowAddModal(false);
                setLastOperation("add");
                setErrorMessage("");
                setIsSuccessModalOpen(true);
                fetchAccounts();
            }
        } catch (error) {
            console.error("Lỗi khi thêm tài khoản:", error);
            if (error.response?.status === 403) {
                setIsErrorModalOpen(true);
            } else if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrors({
                    api: error.response?.data?.message || "Có lỗi xảy ra khi thêm tài khoản.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        setCurrentPage(0);
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

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Quản lý Tài khoản</h1>

            {/* Thanh tìm kiếm */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tài khoản..."
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={handleSearchChange}
                    disabled={isLoading}
                />
            </div>

            {/* Dropdown lọc loại tài khoản và nút thêm tài khoản */}
            <div className="flex gap-4 mb-6">
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(0);
                    }}
                >
                    {roleOptions.map((role) => (
                        <option key={role.id || "all"} value={role.id}>
                            {role.name}
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
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Thêm Tài khoản Admin
                </motion.button>
            </div>

            {/* Hiển thị thông báo nếu không xác định được quyền */}
            {currentUserRole === null && (
                <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    <p>Đang tải thông tin quyền người dùng. Nếu kéo dài, vui lòng đăng nhập lại.</p>
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">Mã tài khoản</th>
                            <th className="p-3">Tên tài khoản</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Loại tài khoản</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="5" className="p-3 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : accounts.length > 0 ? (
                                accounts.map((account) => {
                                    console.log(
                                        `Account ${account.id}: roleId=${account.roleId}, roleName=${account.role}, currentUserRole=${currentUserRole}`
                                    );
                                    return (
                                        <motion.tr
                                            key={account.id}
                                            className="border-b hover:bg-gray-100 transition"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <td className="p-3 text-center font-semibold text-blue-600">
                                                {account.id}
                                            </td>
                                            <td className="p-3 text-center">{account.username}</td>
                                            <td className="p-3 text-center">{account.email}</td>
                                            <td className={`p-3 text-center ${getRoleStyles(account.role)}`}>
                                                {account.role}
                                            </td>
                                            <td className="p-3 flex justify-center gap-2">
                                                {account.role === "Administrator" ? (
                                                    <span className="text-gray-500 italic">
                                                        Tài khoản cao nhất, không thể chỉnh sửa
                                                    </span>
                                                ) : (
                                                    <>
                                                        <motion.button
                                                            className={`bg-gradient-to-r ${account.isLocked
                                                                ? "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                                                : "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                                                } text-white px-3 py-1 rounded-lg flex items-center shadow`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() =>
                                                                account.isLocked
                                                                    ? handleUnlockAccount(account.id)
                                                                    : handleLockAccount(account.id)
                                                            }
                                                            disabled={isLoading ||
                                                                !((currentUserRole === 1 && (account.roleId === 2 || account.roleId === 3)) ||
                                                                    (currentUserRole === 2 && account.roleId === 3))}
                                                        >
                                                            {account.isLocked ? (
                                                                <>
                                                                    <LockOpenIcon className="w-5 h-5 mr-1" />
                                                                    Mở khóa
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LockClosedIcon className="w-5 h-5 mr-1" />
                                                                    Khóa
                                                                </>
                                                            )}
                                                        </motion.button>
                                                        {(currentUserRole === 1 && (account.roleId === 2 || account.roleId === 3)) ||
                                                            (currentUserRole === 2 && account.roleId === 3) ? (
                                                            <motion.button
                                                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-yellow-600 hover:to-orange-600"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleResetPassword(account.id)}
                                                                disabled={isLoading}
                                                            >
                                                                <KeyIcon className="w-5 h-5 mr-1" />
                                                                Đặt lại mật khẩu
                                                            </motion.button>
                                                        ) : account.roleId === null ? (
                                                            <span className="text-red-500 italic">
                                                                Lỗi: Quyền tài khoản không xác định
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="5" className="p-3 text-center text-gray-500">
                                        Không tìm thấy tài khoản
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
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

            {/* Modal Thêm Tài khoản Admin */}
            <Modal
                isOpen={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
                className="bg-white p-6 rounded-lg w-[50%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Thêm Tài khoản Admin</h2>
                </div>
                {errors.api && <p className="text-red-500 text-sm mt-2 mx-4">{errors.api}</p>}
                <div className="grid grid-cols-1 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""
                                }`}
                            value={newAccount.email}
                            onChange={(e) => {
                                setNewAccount({ ...newAccount, email: e.target.value });
                                setErrors((prev) => ({ ...prev, email: null }));
                            }}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quyền</label>
                        <select
                            className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roleId ? "border-red-500" : ""
                                }`}
                            value={newAccount.roleId}
                            onChange={(e) => {
                                setNewAccount({ ...newAccount, roleId: e.target.value });
                                setErrors((prev) => ({ ...prev, roleId: null }));
                            }}
                            disabled={isLoading}
                        >
                            <option value="">Chọn quyền</option>
                            {roleAddModal.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
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
                        onClick={handleSaveAccount}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Lưu"}
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Thông Báo Thành Công */}
            <Modal
                isOpen={isSuccessModalOpen}
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
                            : lastOperation === "lock"
                                ? "Khóa tài khoản thành công!"
                                : lastOperation === "unlock"
                                    ? "Mở khóa tài khoản thành công!"
                                    : lastOperation === "add"
                                        ? "Thêm tài khoản admin thành công!"
                                        : lastOperation === "reset"
                                            ? "Đặt lại mật khẩu thành công!"
                                            : "Thao tác thành công!"}
                    </h2>
                    <div className="flex justify-center">
                        <motion.button
                            className={`bg-gradient-to-r ${errorMessage
                                ? "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                : "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
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

            {/* Modal Thông Báo Lỗi 403 */}
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
                    <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                        Bạn không có quyền thực hiện chức năng này
                    </h2>
                    <div className="flex justify-center">
                        <motion.button
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsErrorModalOpen(false)}
                        >
                            Đóng
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
}