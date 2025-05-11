import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Liên kết không hợp lệ. Vui lòng thử lại.');
        }
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:8080/auth/reset-password', {
                token,
                newPassword,
            });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', { autoClose: 2000 });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data || 'Liên kết không hợp lệ hoặc đã hết hạn.');
            } else if (err.response?.status === 404) {
                setError('Người dùng không tồn tại.');
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url('https://bcp.cdnchinhphu.vn/Uploaded/hoangtrongdien/2020_04_07/thu%20vien.jpg')`,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backgroundBlendMode: 'darken'
            }}
        >
            <div className="bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-600 min-h-[400px]">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-white tracking-tight">
                    Đặt lại mật khẩu
                </h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-6">
                        <label className="block text-gray-100 mb-2 text-sm font-semibold" htmlFor="newPassword">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 bg-gray-800 bg-opacity-70 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-100 mb-2 text-sm font-semibold" htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 bg-gray-800 bg-opacity-70 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>
                    {error && (
                        <div className="mb-6 text-red-400 text-center text-sm animate-fade-in">{error}</div>
                    )}
                    {isLoading && (
                        <div className="flex justify-center mb-6">
                            <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                            </svg>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${isLoading || !token
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                            }`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar closeOnClick />
            </div>
        </div>
    );
}

export default ResetPassword;