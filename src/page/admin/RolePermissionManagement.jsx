import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

Modal.setAppElement("#root");

export default function RolePermissionManagement() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [lastOperation, setLastOperation] = useState("");

    const roleOptions = [
        { id: 1, name: "Administrator" },
        { id: 2, name: "Admin" },
        { id: 3, name: "Student" },
    ];

    // Lấy danh sách quyền và phân quyền khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("Vui lòng đăng nhập để tiếp tục.");
                }

                // Cấu hình header Authorization
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };

                // Lấy tất cả quyền
                console.log("Fetching permissions from /admin/permission/all...");
                const permissionsResponse = await axios.get("http://localhost:8080/admin/permission/all", config);
                console.log("Permissions received:", permissionsResponse.data);
                setPermissions(permissionsResponse.data);

                // Lấy phân quyền theo vai trò
                console.log("Fetching role permissions from /admin/rolepermission/all...");
                const rolePermissionsResponse = await axios.get("http://localhost:8080/admin/rolepermission/all", config);
                console.log("Role permissions received:", rolePermissionsResponse.data);
                const rolePermMap = {};
                rolePermissionsResponse.data.forEach((role) => {
                    rolePermMap[role.roleId] = role.permissionIds;
                });
                setRolePermissions(rolePermMap);
                setRoles(roleOptions);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", {
                    message: error.message,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data,
                    } : null,
                });
                setErrorMessage(
                    error.response?.data?.message ||
                    `Không thể tải dữ liệu quyền: ${error.message}`
                );
                setIsSuccessModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Xử lý bật/tắt quyền cho vai trò Admin
    const handlePermissionToggle = async (roleId, permissionId) => {
        if (roleId !== 2) return; // Chỉ cho phép thay đổi với vai trò Admin

        setIsLoading(true);
        const isCurrentlyChecked = rolePermissions[roleId]?.includes(permissionId);
        // Chuẩn bị payload dạng chuỗi
        const payload = {
            roleId: roleId.toString(),
            permissionId: permissionId.toString(),
        };

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Vui lòng đăng nhập để tiếp tục.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            let response;
            if (isCurrentlyChecked) {
                // Xóa quyền
                console.log("Gửi yêu cầu DELETE với payload:", payload);
                response = await axios.delete("http://localhost:8080/admin/rolepermission/delete", {
                    data: payload,
                    ...config,
                });
                if (response.data === true) {
                    setRolePermissions((prev) => {
                        const updatedPermissions = [...(prev[roleId] || [])];
                        const index = updatedPermissions.indexOf(permissionId);
                        if (index > -1) updatedPermissions.splice(index, 1);
                        return { ...prev, [roleId]: updatedPermissions };
                    });
                    setLastOperation("delete");
                    setErrorMessage("");
                    setIsSuccessModalOpen(true);
                } else {
                    throw new Error("API trả về false khi xóa quyền");
                }
            } else {
                // Thêm quyền
                console.log("Gửi yêu cầu POST với payload:", payload);
                response = await axios.post("http://localhost:8080/admin/rolepermission/add", payload, config);
                // Kiểm tra phản hồi là object chứa roleId và permissionId
                if (response.data && response.data.roleId == roleId && response.data.permissionId == permissionId) {
                    setRolePermissions((prev) => {
                        const updatedPermissions = [...(prev[roleId] || [])];
                        updatedPermissions.push(permissionId);
                        return { ...prev, [roleId]: updatedPermissions };
                    });
                    setLastOperation("add");
                    setErrorMessage("");
                    setIsSuccessModalOpen(true);
                } else {
                    throw new Error("Phản hồi API không hợp lệ khi thêm quyền");
                }
            }
        } catch (error) {
            console.error(`Lỗi khi ${isCurrentlyChecked ? "xóa" : "thêm"} quyền:`, {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
            setLastOperation(isCurrentlyChecked ? "delete" : "add");
            setErrorMessage(
                error.response?.data?.message ||
                `Không thể ${isCurrentlyChecked ? "xóa" : "thêm"} quyền: ${error.message}`
            );
            setIsSuccessModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">
                Quản lý Phân quyền
            </h1>

            {/* Bảng phân quyền */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3 text-left">Loại tài khoản</th>
                            {permissions.map((perm) => (
                                <th key={perm.permissionId} className="p-3 text-center" title={perm.description}>
                                    {perm.permissionName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td
                                        colSpan={permissions.length + 1}
                                        className="p-3 text-center text-gray-500"
                                    >
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : roles.length > 0 ? (
                                roles.map((role) => (
                                    <motion.tr
                                        key={role.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 font-semibold text-blue-600">
                                            {role.name}
                                        </td>
                                        {permissions.map((perm) => (
                                            <td key={perm.permissionId} className="p-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={rolePermissions[role.id]?.includes(
                                                        perm.permissionId
                                                    )}
                                                    onChange={() =>
                                                        handlePermissionToggle(role.id, perm.permissionId)
                                                    }
                                                    disabled={role.id !== 2 || isLoading}
                                                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                                                />
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td
                                        colSpan={permissions.length + 1}
                                        className="p-3 text-center text-gray-500"
                                    >
                                        Không tìm thấy dữ liệu
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal thông báo thành công/lỗi */}
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
                    <h2
                        className={`text-xl font-bold ${errorMessage ? "text-red-600" : "text-green-600"} mb-4 text-center`}
                    >
                        {errorMessage
                            ? errorMessage
                            : lastOperation === "add"
                                ? "Thêm quyền thành công!"
                                : lastOperation === "delete"
                                    ? "Xóa quyền thành công!"
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
                            onClick={() => setIsSuccessModalOpen(false)}
                        >
                            Đóng
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
}