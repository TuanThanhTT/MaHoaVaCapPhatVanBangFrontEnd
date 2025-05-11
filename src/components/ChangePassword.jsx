import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { LockClosedIcon } from "@heroicons/react/24/solid";

Modal.setAppElement("#root");

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Regex cho mật khẩu: ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số, ký tự đặc biệt
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Lấy username từ JWT token
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setErrorMessage("Không tìm thấy token. Vui lòng đăng nhập.");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userName = payload.sub || payload.username || payload.name;
            if (!userName) {
                setErrorMessage("Không thể xác định tên người dùng. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
                return;
            }
            setUsername(userName);
        } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
            setErrorMessage("Token không hợp lệ. Vui lòng đăng nhập lại.");
            setTimeout(() => navigate("/login"), 2000);
        }
    }, [navigate]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    // Xác thực form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.oldPassword.trim()) {
            newErrors.oldPassword = "Mật khẩu cũ không được để trống.";
        }
        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "Mật khẩu mới không được để trống.";
        } else if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword =
                "Mật khẩu mới phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống.";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }
        return newErrors;
    };

    // Gửi yêu cầu đổi mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                username,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            };
            const response = await axios.put(
                "http://localhost:8080/admin/user/change",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setErrorMessage("");
                setIsSuccessModalOpen(true);
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                setErrorMessage(response.data.message || "Đổi mật khẩu không thành công.");
                setIsErrorModalOpen(true);
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            if (error.response?.status === 401) {
                setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else if (error.response?.status === 403) {
                setErrorMessage("Bạn không có quyền thực hiện chức năng này.");
                setIsErrorModalOpen(true);
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
                );
                setIsErrorModalOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">
                Đổi Mật Khẩu
            </h1>

            {/* Form đổi mật khẩu */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">
                        Mật khẩu cũ
                    </label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.oldPassword ? "border-red-500" : ""
                            }`}
                        disabled={isLoading}
                    />
                    {errors.oldPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newPassword ? "border-red-500" : ""
                            }`}
                        disabled={isLoading}
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : ""
                            }`}
                        disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <motion.button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-lg shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-indigo-600"
                        }`}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : (
                        <>
                            <LockClosedIcon className="w-5 h-5 inline mr-2" />
                            Đổi Mật Khẩu
                        </>
                    )}
                </motion.button>
            </form>

            {/* Modal Thành công */}
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
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
                        Đổi mật khẩu thành công!
                    </h2>
                    <div className="flex justify-center">
                        <motion.button
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSuccessModalOpen(false)}
                        >
                            Đóng
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>

            {/* Modal Lỗi */}
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
                        {errorMessage || "Có lỗi xảy ra!"}
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
};

export default ChangePassword;