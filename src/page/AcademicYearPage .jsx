import { useState } from "react";
import Modal from "react-modal";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

Modal.setAppElement("#root"); // Định nghĩa root cho modal

const AcademicYearPage = () => {
    const [academicYears, setAcademicYears] = useState([
        { id: 1, name: "2023 - 2024" },
        { id: 2, name: "2024 - 2025" }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    const [yearName, setYearName] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    // Mở modal nhập năm học
    const openModal = (year = null) => {
        setEditingYear(year);
        setYearName(year ? year.name : "");
        setIsModalOpen(true);
    };

    // Lưu hoặc cập nhật năm học
    const handleSaveYear = () => {
        if (yearName.trim() === "") return;
        if (editingYear) {
            setAcademicYears(academicYears.map(y => (y.id === editingYear.id ? { ...y, name: yearName } : y)));
        } else {
            setAcademicYears([...academicYears, { id: Date.now(), name: yearName }]);
        }
        setIsModalOpen(false);
    };

    // Mở modal xác nhận xóa
    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    // Xóa năm học
    const handleDeleteYear = () => {
        setAcademicYears(academicYears.filter(year => year.id !== deleteId));
        setIsDeleteModalOpen(false);
        alert("Năm học đã được xóa thành công!");
    };

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase justify-center">
                Cài đặt Năm học
            </h2>

            {/* Nút thêm */}
            <motion.button
                onClick={() => openModal()}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-transform duration-200 active:scale-95"
                whileHover={{ scale: 1.05 }}
            >
                <PlusCircleIcon className="w-5 h-5 mr-2" /> Thêm Năm Học
            </motion.button>

            {/* Bảng danh sách năm học */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="border p-3 text-left">📌 ID</th>
                            <th className="border p-3 text-left">📅 Năm học</th>
                            <th className="border p-3 text-center">⚙️ Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {academicYears.map((year) => (
                                <motion.tr
                                    key={year.id}
                                    className="border hover:bg-gray-50"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="border p-3">{year.id}</td>
                                    <td className="border p-3">{year.name}</td>
                                    <td className="border p-3 flex justify-center space-x-3">
                                        {/* Nút Sửa */}
                                        <motion.button
                                            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center hover:bg-blue-600 transition-transform duration-200 active:scale-95"
                                            onClick={() => openModal(year)}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <PencilSquareIcon className="w-5 h-5 mr-1" /> Sửa
                                        </motion.button>

                                        {/* Nút Xóa */}
                                        <motion.button
                                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center hover:bg-red-600 transition-transform duration-200 active:scale-95"
                                            onClick={() => openDeleteModal(year.id)}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <TrashIcon className="w-5 h-5 mr-1" /> Xóa
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal nhập năm học */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">{editingYear ? "Sửa" : "Thêm"} Năm Học</h2>
                <input
                    type="text"
                    value={yearName}
                    onChange={(e) => setYearName(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Nhập năm học (VD: 2025 - 2026)"
                />
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">
                        Hủy
                    </button>
                    <button
                        onClick={handleSaveYear}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Lưu
                    </button>
                </div>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={() => setIsDeleteModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa năm học này?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border rounded-lg">
                        Hủy
                    </button>
                    <button
                        onClick={handleDeleteYear}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AcademicYearPage;
