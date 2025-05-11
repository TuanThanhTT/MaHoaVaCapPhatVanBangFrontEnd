import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

// Thiết lập root element cho Modal
Modal.setAppElement("#root");

function ViewDiplomaImages() {
    const navigate = useNavigate();
    const [images, setImages] = useState({
        frontImage: '/mattruoc.jpg', // Ảnh mặt trước tĩnh
        backImage: null, // Ảnh mặt sau từ API
        diplomaId: null, // ID văn bằng (sử dụng username)
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            // Lấy token từ localStorage
            const token = localStorage.getItem('jwtToken');
            console.log('JWT Token:', token ? token.substring(0, 20) + '...' : 'Không tìm thấy token');

            if (!token) {
                setErrorMessage('Không tìm thấy token. Vui lòng đăng nhập.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            let username, roles, exp;
            try {
                // Giải mã payload của token
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT Payload:', payload);
                username = payload.sub || payload.username || payload.email || payload.name;
                exp = payload.exp;
                roles = payload.roles ||
                    payload.authorities?.map(auth => auth.authority) ||
                    payload.role ||
                    payload.ROLE ||
                    payload.scopes || [];
                if (typeof roles === 'string') roles = [roles];
                console.log('Username:', username, 'Roles:', roles, 'Exp:', new Date(exp * 1000));

                // Kiểm tra token hết hạn
                const currentTime = Math.floor(Date.now() / 1000);
                if (exp < currentTime) {
                    setErrorMessage('Token đã hết hạn. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('jwtToken');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                // Kiểm tra quyền ROLE_STUDENT
                if (!roles.includes('ROLE_STUDENT') && !roles.includes('student')) {
                    setErrorMessage('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản sinh viên.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                if (!username) {
                    setErrorMessage('Không tìm thấy thông tin người dùng trong token. Vui lòng đăng nhập lại.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                // Gọi API POST để lấy hình ảnh mặt sau
                console.log('Gọi API POST với username:', username);
                const response = await axios.post(
                    `http://localhost:8080/admin/degree/img/username`,
                    username, // Gửi username dạng chuỗi thuần túy
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'text/plain',
                        },
                        responseType: 'blob', // Nhận dữ liệu dạng binary (ảnh)
                    }
                );

                // Tạo URL tạm thời cho hình ảnh
                const backImageUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
                setImages({
                    frontImage: '/mattruoc.jpg',
                    backImage: backImageUrl,
                    diplomaId: username,
                });
            } catch (error) {
                console.error('Lỗi khi xử lý yêu cầu:', {
                    message: error.message,
                    code: error.code,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers,
                    } : null,
                });

                if (error.name === 'TypeError' && error.message.includes('atob')) {
                    setErrorMessage('Token không hợp lệ. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('jwtToken');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('Phiên đăng nhập hết hạn hoặc token không hợp lệ. Vui lòng đăng nhập lại.');
                        localStorage.removeItem('jwtToken');
                        setTimeout(() => navigate('/login'), 2000);
                    } else if (error.response.status === 403) {
                        setErrorMessage('Bạn không có quyền truy cập vào tài nguyên này.');
                        setTimeout(() => navigate('/login'), 2000);
                    } else if (error.response.status === 404) {
                        setErrorMessage('Chưa có văn bằng được cấp phát.');
                    } else if (error.response.status === 500) {
                        setErrorMessage('Lỗi server. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
                    } else {
                        setErrorMessage('Không thể tải hình ảnh văn bằng. Vui lòng thử lại sau.');
                    }
                } else {
                    setErrorMessage('Lỗi kết nối đến server. Vui lòng kiểm tra lại.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [navigate]);

    // Xử lý tải cả hai hình ảnh (mặt trước và mặt sau) trên frontend
    const handleDownload = async () => {
        if (!images.diplomaId) {
            setErrorMessage('Không có văn bằng để tải.');
            return;
        }

        if (!images.backImage) {
            setErrorMessage('Không có hình ảnh mặt sau để tải.');
            return;
        }

        try {
            // Tải hình ảnh mặt trước (từ URL tĩnh)
            const frontImageResponse = await fetch(images.frontImage);
            if (!frontImageResponse.ok) {
                throw new Error('Không thể tải hình ảnh mặt trước.');
            }
            const frontImageBlob = await frontImageResponse.blob();
            const frontImageUrl = window.URL.createObjectURL(frontImageBlob);

            // Tạo link tải cho mặt trước
            const frontLink = document.createElement('a');
            frontLink.href = frontImageUrl;
            frontLink.setAttribute('download', `van-bang-mat-truoc-${images.diplomaId}.png`);
            document.body.appendChild(frontLink);
            frontLink.click();
            document.body.removeChild(frontLink);
            window.URL.revokeObjectURL(frontImageUrl);

            // Tải hình ảnh mặt sau (từ Blob URL)
            const backLink = document.createElement('a');
            backLink.href = images.backImage;
            backLink.setAttribute('download', `van-bang-mat-sau-${images.diplomaId}.png`);
            document.body.appendChild(backLink);
            backLink.click();
            document.body.removeChild(backLink);
            // Không cần revoke backImage vì nó sẽ được xử lý khi component unmount
        } catch (error) {
            console.error('Lỗi khi tải hình ảnh:', error);
            setErrorMessage('Không thể tải hình ảnh. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-5xl w-full p-10">
                <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">
                    Xem Văn Bằng Tốt Nghiệp
                </h1>

                {isLoading ? (
                    <p className="text-center text-white">Đang tải dữ liệu...</p>
                ) : images.backImage ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="relative group">
                            <h2 className="text-lg font-semibold text-white mb-2">Mặt Trước</h2>
                            <img
                                src={images.frontImage}
                                alt="Mặt trước văn bằng"
                                className="w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg transform transition-all duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                        <div className="relative group">
                            <h2 className="text-lg font-semibold text-white mb-2">Mặt Sau</h2>
                            <img
                                src={images.backImage}
                                alt="Mặt sau văn bằng"
                                className="w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg transform transition-all duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-400">Không có hình ảnh văn bằng để hiển thị.</p>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300"
                    >
                        <FaArrowLeft /> Quay lại
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg transition-all duration-300"
                    >
                        <FaDownload /> Tải về
                    </button>
                </div>
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
                                    if (errorMessage.includes('đăng nhập') || errorMessage.includes('quyền')) {
                                        navigate('/login');
                                    }
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

export default ViewDiplomaImages;