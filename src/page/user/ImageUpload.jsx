import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function ImageUpload() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setResult(null);
        setProgress(0);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setResult(null);
        setProgress(0);
    };

    const handleVerify = async () => {
        if (!file) {
            setResult({ valid: false, message: "Vui lòng chọn tệp văn bằng" });
            return;
        }

        if (!file.name.toLowerCase().endsWith('.png')) {
            setResult({ valid: false, message: "Chỉ hỗ trợ tệp PNG" });
            return;
        }

        setLoading(true);
        setProgress(50);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/degree/export/check", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            const isValid = response.data.status.includes("hợp lệ");
            setResult({
                valid: isValid,
                message: isValid ? response.data.message : "Văn bằng không hợp lệ",
            });
        } catch (error) {
            console.error("Lỗi khi kiểm tra văn bằng:", error);
            setResult({
                valid: false,
                message: error.response?.data?.message || "Có lỗi xảy ra khi kiểm tra văn bằng",
            });
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
            <motion.div
                className="bg-white p-8 rounded-3xl shadow-lg w-full text-center max-w-lg sm:max-w-xl lg:max-w-2xl border border-gray-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Kiểm Tra Văn Bằng</h1>
                <div className="relative">
                    <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-all flex flex-col items-center justify-center bg-gray-50 shadow-sm">
                        <Upload size={40} className="text-gray-600 mb-3" />
                        <span className="text-gray-600 text-lg font-medium">Chọn hoặc kéo thả tệp PNG</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".png"
                        />
                    </label>
                    {file && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-gray-200 rounded-lg shadow-inner">
                            <span className="text-gray-700 text-sm truncate">{file.name}</span>
                            <X
                                size={20}
                                className="text-red-500 cursor-pointer"
                                onClick={handleRemoveFile}
                            />
                        </div>
                    )}
                </div>

                {loading && (
                    <motion.div
                        className="w-full h-3 bg-gray-300 rounded-full mt-4 overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                    >
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                )}

                <button
                    className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleVerify}
                    disabled={loading || !file}
                >
                    Kiểm tra
                </button>

                {result && (
                    <motion.div
                        className={`mt-6 p-5 rounded-2xl text-white flex flex-col items-center shadow-md ${result.valid ? "bg-green-500" : "bg-red-500"}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {result.valid ? (
                            <>
                                <CheckCircle size={32} className="mb-2" />
                                <p className="text-lg font-semibold">Văn bằng hợp lệ</p>
                                <p className="text-sm mt-2">{result.message}</p>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={32} className="mb-2" />
                                <p className="text-lg font-semibold">Văn bằng không hợp lệ</p>
                                <p className="text-sm mt-2">{result.message}</p>
                            </>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}