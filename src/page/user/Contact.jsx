import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý dữ liệu form (ví dụ, gửi email hoặc lưu vào cơ sở dữ liệu)
        console.log(formData);
        // Reset form sau khi gửi
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="relative container mx-auto p-6 mt-12 mb-12 bg-cover bg-center"
            style={{ backgroundImage: "url('bg1.png')" }}>

            {/* Lớp phủ kính mờ */}
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md z-10"></div>

            <header className="text-center mb-12 animate__animated animate__fadeIn relative z-20">
                <h1 className="text-3xl font-bold uppercase text-red-600">Liên Hệ Với Chúng Tôi</h1>
                <p className="text-lg text-white">Hãy để lại tin nhắn, chúng tôi sẽ trả lời bạn trong thời gian sớm nhất!</p>
            </header>

            <div className="max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-1s bg-white p-6 rounded-lg shadow-lg bg-opacity-75 relative z-30">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Họ và tên */}
                    <div className="animate__animated animate__fadeInUp animate__delay-2s">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="animate__animated animate__fadeInUp animate__delay-3s">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    {/* Tin nhắn */}
                    <div className="animate__animated animate__fadeInUp animate__delay-4s">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tin nhắn</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tin nhắn của bạn"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    {/* Nút Gửi */}
                    <div className="animate__animated animate__fadeInUp animate__delay-5s">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        >
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Contact;
