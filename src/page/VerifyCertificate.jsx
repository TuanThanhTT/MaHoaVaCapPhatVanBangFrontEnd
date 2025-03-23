import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle, AlertTriangle } from "lucide-react";

export default function VerifyCertificate() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setResult(null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setResult(null);
        setProgress(0);
    };

    const handleVerify = () => {
        if (!file) return;
        setLoading(true);
        setProgress(50);

        setTimeout(() => setProgress(70), 1000);
        setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setResult({ valid: Math.random() > 0.5, student: "Nguyễn Văn A", gpa: "3.8" });
            }, 500);
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <motion.div
                className="bg-white p-8 rounded-3xl shadow-2xl w-full text-center max-w-lg sm:max-w-xl lg:max-w-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Xác thực Văn Bằng</h1>
                <div className="relative">
                    <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-all flex flex-col items-center justify-center bg-gray-50 shadow-sm">
                        <Upload size={40} className="text-gray-500 mb-3" />
                        <span className="text-gray-600 text-lg font-medium">Chọn hoặc kéo thả tệp PDF</span>
                        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </label>
                    {file && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-gray-200 rounded-lg shadow-inner">
                            <span className="text-gray-700 text-sm truncate">{file.name}</span>
                            <X size={20} className="text-red-500 cursor-pointer" onClick={handleRemoveFile} />
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
                    className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleVerify}
                    disabled={loading}
                >
                    Xác thực
                </button>

                {result && (
                    <motion.div
                        className={`mt-6 p-5 rounded-2xl text-white flex flex-col items-center shadow-lg ${result.valid ? "bg-green-500" : "bg-red-500"}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {result.valid ? (
                            <>
                                <CheckCircle size={32} className="mb-2" />
                                <p className="text-lg font-semibold">Văn bằng hợp lệ</p>
                                <p>Sinh viên: {result.student}</p>
                                <p>GPA: {result.gpa}</p>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={32} className="mb-2" />
                                <p className="text-lg font-semibold">Văn bằng không hợp lệ</p>
                            </>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
