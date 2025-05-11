import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);

            // Kiểm tra vai trò từ token
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
            const isAdmin = decoded.roles.includes('ROLE_ADMINISTRATOR') || decoded.roles.includes('ROLE_ADMIN');

            // Hiển thị thông báo thành công
            toast.success('Đăng nhập thành công!', { autoClose: 1000 });

            // Điều hướng theo vai trò
            if (isAdmin) {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError(err.response.data || 'Tên đăng nhập hoặc mật khẩu không đúng');
            } else if (err.response?.status === 403) {
                setError('Không có quyền truy cập');
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8080/auth/forgot-password', {
                email,
            });
            toast.success('Liên kết khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email.', { autoClose: 3000 });
            setEmail('');
            setIsForgotPassword(false);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Email không tồn tại.');
            } else if (err.response?.status === 400) {
                setError(err.response.data || 'Yêu cầu không hợp lệ.');
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
                    {isForgotPassword ? 'Khôi phục mật khẩu' : 'Đăng nhập'}
                </h2>
                <AnimatePresence mode="wait">
                    {isForgotPassword ? (
                        <motion.form
                            key="forgot-password"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleForgotPassword}
                        >
                            <div className="mb-6">
                                <label className="block text-gray-100 mb-2 text-sm font-semibold" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
                                    placeholder="Nhập email của bạn"
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
                                disabled={isLoading}
                                className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                                    }`}
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setError('');
                                    setEmail('');
                                }}
                                className="w-full p-3 mt-3 rounded-lg text-gray-200 font-semibold border border-gray-500 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-300"
                            >
                                Quay lại đăng nhập
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleLogin}
                        >
                            <div className="mb-6">
                                <label className="block text-gray-100 mb-2 text-sm font-semibold" htmlFor="username">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-100 mb-2 text-sm font-semibold" htmlFor="password">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
                                    placeholder="Nhập mật khẩu"
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
                                disabled={isLoading}
                                className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                                    }`}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                            <div className="flex justify-between mt-4 text-sm flex-nowrap">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError('');
                                        setUsername('');
                                        setPassword('');
                                    }}
                                    className="text-gray-200 hover:text-blue-400 hover:underline transition-all duration-300"
                                >
                                    Quên mật khẩu?
                                </button>
                                <Link
                                    to="/"
                                    className="text-gray-200 hover:text-blue-400 hover:underline transition-all duration-300"
                                >
                                    Trở về trang chủ
                                </Link>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
                <ToastContainer position="top-right" autoClose={1000} hideProgressBar closeOnClick />
            </div>
        </div>
    );
}

export default Login;