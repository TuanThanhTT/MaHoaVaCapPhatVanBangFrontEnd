import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

Modal.setAppElement("#root");

function ViewDiploma() {
    const navigate = useNavigate();
    const [diploma, setDiploma] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkTokenAndFetchData = async () => {
            const token = localStorage.getItem('jwtToken');
            console.log('JWT Token from localStorage:', token);

            if (!token) {
                setErrorMessage('Không tìm thấy token. Vui lòng đăng nhập.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            let username, roles, sub, exp;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT Payload:', payload);
                sub = payload.sub || payload.username || payload.email || payload.name;
                username = sub;
                exp = payload.exp;
                roles = payload.roles ||
                    payload.authorities?.map(auth => auth.authority) ||
                    payload.role ||
                    payload.ROLE ||
                    payload.scopes || [];
                if (typeof roles === 'string') roles = [roles];
                console.log('Sub:', sub, 'Username:', username, 'Quyền:', roles, 'Exp:', new Date(exp * 1000));

                const currentTime = Math.floor(Date.now() / 1000);
                if (exp < currentTime) {
                    setErrorMessage('Token đã hết hạn. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('jwtToken');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                setErrorMessage('Token không hợp lệ. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (!roles.includes('ROLE_STUDENT') && !roles.includes('student')) {
                console.warn('Không tìm thấy ROLE_STUDENT trong token. Quyền:', roles);
                setErrorMessage('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản sinh viên.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (!username) {
                setErrorMessage('Không tìm thấy thông tin người dùng trong token. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
                console.warn('Username không phải email hợp lệ:', username);
                setErrorMessage('Tên người dùng không hợp lệ. Vui lòng đăng nhập với tài khoản sinh viên hợp lệ.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            try {
                console.log('Thử gọi POST với body:', username, 'Token:', token.substring(0, 20) + '...');
                let response = await axios.post(
                    `http://localhost:8080/admin/degree/info/username`,
                    username,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'text/plain',
                        },
                    }
                );
                console.log('Phản hồi POST:', response.data, 'Mã trạng thái:', response.status);

                // Xử lý ánh xạ gpa và định dạng giá trị Float
                const gpaValue = response.data.gpa || 0; // Sử dụng gpa thay vì GPA
                setDiploma({
                    fullName: response.data.fullName || '',
                    address: response.data.address || '',
                    email: response.data.email || '',
                    faculty: response.data.faculty || '',
                    major: response.data.major || '',
                    gpa: Number.isFinite(gpaValue) ? gpaValue.toFixed(2) : '0.00', // Định dạng gpa với 2 chữ số thập phân
                    ranking: response.data.degreeClassification || '',
                    degreeType: response.data.degreeType || '',
                    status: response.data.status || '',
                });
            } catch (error) {
                console.error('Lỗi khi lấy thông tin văn bằng:', {
                    message: error.message,
                    code: error.code,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers
                    } : null,
                    request: error.request,
                });
                if (error.response) {
                    if (error.response.status === 403) {
                        setErrorMessage('Không có quyền truy cập. Token không hợp lệ hoặc thiếu quyền. Vui lòng đăng nhập lại.');
                    } else if (error.response.status === 404) {
                        setErrorMessage('Không tìm thấy thông tin văn bằng cho tài khoản này.');
                    } else {
                        setErrorMessage(
                            error.response.data?.message ||
                            `Lỗi ${error.response.status}: Không thể lấy thông tin văn bằng.`
                        );
                    }
                    if (error.response.status === 401) {
                        setErrorMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                        localStorage.removeItem('jwtToken');
                        setTimeout(() => navigate('/login'), 2000);
                    }
                } else if (error.request) {
                    setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc cấu hình CORS.');
                } else {
                    setErrorMessage(`Lỗi: ${error.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkTokenAndFetchData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all duration-300 hover:shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">
                    Thông Tin Văn Bằng Tốt Nghiệp
                </h1>

                {isLoading ? (
                    <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
                ) : diploma ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Tên sinh viên</label>
                            <input
                                type="text"
                                value={diploma.fullName}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Quê quán</label>
                            <input
                                type="text"
                                value={diploma.address}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="text"
                                value={diploma.email}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Khoa</label>
                            <input
                                type="text"
                                value={diploma.faculty}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Chuyên ngành</label>
                            <input
                                type="text"
                                value={diploma.major}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">GPA</label>
                            <input
                                type="text"
                                value={diploma.gpa}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Loại xếp hạng</label>
                            <input
                                type="text"
                                value={diploma.ranking}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Loại bằng</label>
                            <input
                                type="text"
                                value={diploma.degreeType}
                                readOnly
                                className="w-2/3 p-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="w-1/3 text-sm font-semibold text-gray-700">Tình trạng</label>
                            <input
                                type="text"
                                value={diploma.status}
                                readOnly
                                className={`w-2/3 p-3 rounded-lg border border-gray-300 focus:outline-none ${diploma.status === 'Đã cấp' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-600">Không tìm thấy thông tin văn bằng.</p>
                )}

                {!isLoading && (
                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                            <FaArrowLeft /> Quay lại
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                        >
                            <FaPrint /> In văn bằng
                        </button>
                    </div>
                )}
            </div>

            {errorMessage && (
                <Modal
                    isOpen={!!errorMessage}
                    onRequestClose={() => setErrorMessage('')}
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
                                onClick={() => {
                                    setErrorMessage('');
                                    navigate('/login');
                                }}
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

export default ViewDiploma;