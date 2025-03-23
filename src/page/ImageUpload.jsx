import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);

        // Giả lập quá trình tải lên và cập nhật thanh tiến trình
        const simulateUpload = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(simulateUpload);
                    setIsUploading(false);
                    setUploadedImage(URL.createObjectURL(file)); // Hiển thị ảnh sau khi tải lên
                    setIsUploaded(true); // Đánh dấu là ảnh đã được tải lên
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 500);
    };

    // Kích hoạt file input khi nhấp vào nút tải lên
    const triggerFileInput = () => {
        document.getElementById("file-input").click();
    };

    // Xóa ảnh đã chọn
    const handleRemoveFile = () => {
        setFile(null); // Xóa ảnh đã chọn
        setUploadedImage(null); // Xóa ảnh đã tải lên
    };

    const handleCheckCertificate = () => {
        // Xử lý kiểm tra văn bằng ở đây
        alert("Đang kiểm tra văn bằng...");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('bg.png')" }}>
            <div className="container w-4/5 mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-xl w-9/12 mx-auto backdrop-blur-md bg-opacity-60 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Kiểm Tra Văn Bằng</h2>

                    {/* Nút tải lên với icon */}
                    <div className="mb-4 flex justify-center animate-scaleIn">
                        <button
                            onClick={triggerFileInput}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <FiUpload className="text-xl" />
                            Chọn ảnh
                        </button>

                        {/* Ẩn input file, chỉ dùng để chọn tệp */}
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {file && (
                        <div className="mb-4 flex items-center justify-between animate-slideIn">
                            <p className="text-sm text-gray-600">Ảnh đã chọn: {file.name}</p>
                            {/* Nút xóa ảnh */}
                            <button
                                onClick={handleRemoveFile}
                                className="text-red-600 hover:text-red-800 text-xl"
                            >
                                <FiX />
                            </button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="mt-4 animate-slideIn">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 text-center">{progress}%</p>
                        </div>
                    )}

                    <div className="flex justify-center mb-6 animate-fadeIn">
                        <button
                            onClick={handleUpload}
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            disabled={isUploading || !file}
                        >
                            {isUploading ? "Đang tải lên..." : "Tải lên"}
                        </button>
                    </div>

                    {/* Hiển thị ảnh đã tải lên hoặc ảnh mẫu */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Ảnh đã tải lên:</h3>
                        <div className="flex justify-center mb-6 animate-fadeIn">
                            <div className="border-4 border-indigo-600 p-4 rounded-lg shadow-lg max-w-sm w-full">
                                <img
                                    src={uploadedImage || "nenanh.jpg"} // Đường dẫn đến ảnh mẫu nếu chưa có ảnh tải lên
                                    alt="Uploaded or Sample"
                                    className="w-full h-auto object-cover rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút kiểm tra văn bằng */}
                    {isUploaded && (
                        <div className="flex justify-center mt-6 animate-fadeIn">
                            <button
                                onClick={handleCheckCertificate}
                                className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Kiểm tra văn bằng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
