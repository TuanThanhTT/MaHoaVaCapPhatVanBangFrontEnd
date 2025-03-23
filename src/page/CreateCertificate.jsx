import { useState } from "react";

const CreateCertificate = () => {
    const initialStudents = [
        { id: 1, maSV: "SV001", ten: "Nguyễn Văn A", khoa: "CNTT", chuyenNganh: "Khoa học máy tính" },
        { id: 2, maSV: "SV002", ten: "Trần Thị B", khoa: "CNTT", chuyenNganh: "An toàn thông tin" },
        { id: 3, maSV: "SV003", ten: "Lê Văn C", khoa: "Kinh tế", chuyenNganh: "Quản trị kinh doanh" },
    ];

    const [students, setStudents] = useState(initialStudents);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [filters, setFilters] = useState({ khoa: "", chuyenNganh: "", keyword: "" });

    // Kiểm tra xem có bộ lọc nào đang được sử dụng hay không
    const hasFilters = filters.khoa || filters.chuyenNganh || filters.keyword;

    // Xử lý khi chọn checkbox
    const handleCheckboxChange = (id) => {
        setSelectedStudents((prev) => {
            const newSelection = new Set(prev);
            newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
            return newSelection;
        });
    };

    // Lọc sinh viên theo bộ lọc
    const filteredStudents = students.filter((sv) =>
        (filters.khoa === "" || sv.khoa === filters.khoa) &&
        (filters.chuyenNganh === "" || sv.chuyenNganh === filters.chuyenNganh) &&
        (filters.keyword === "" || sv.ten.toLowerCase().includes(filters.keyword.toLowerCase()))
    );

    // Xử lý tạo văn bằng
    const createCertificate = (id) => {
        if (window.confirm("Bạn có chắc muốn tạo văn bằng?")) {
            alert(`Đã tạo văn bằng cho sinh viên có ID: ${id}`);
        }
    };

    // Xử lý tạo văn bằng hàng loạt
    const createBatchCertificates = () => {
        if (window.confirm("Bạn có chắc muốn tạo văn bằng cho các sinh viên đã chọn?")) {
            alert(`Đã tạo văn bằng cho ${selectedStudents.size} sinh viên!`);
        }
    };

    // Xử lý làm mới bộ lọc
    const resetFilters = () => {
        setFilters({ khoa: "", chuyenNganh: "", keyword: "" });
        setStudents(initialStudents);
        setSelectedStudents(new Set());
    };

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Tạo Văn Bằng</h2>

            {/* Bộ lọc */}
            <div className="flex gap-2 mb-4">
                <select className="border p-2 rounded w-1/3" onChange={(e) => setFilters({ ...filters, khoa: e.target.value })}>
                    <option value="">Chọn Khoa</option>
                    <option value="CNTT">CNTT</option>
                    <option value="Kinh tế">Kinh tế</option>
                </select>

                <select className="border p-2 rounded w-1/3" onChange={(e) => setFilters({ ...filters, chuyenNganh: e.target.value })}>
                    <option value="">Chọn Chuyên Ngành</option>
                    <option value="Khoa học máy tính">Khoa học máy tính</option>
                    <option value="An toàn thông tin">An toàn thông tin</option>
                    <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
                </select>

                <input type="text" placeholder="Tìm kiếm..." className="border p-2 rounded w-1/3"
                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
            </div>

            {/* Nút "Tạo Văn Bằng Hàng Loạt" + Nút "Làm Mới" */}
            <div className="mb-4 flex justify-between">
                {selectedStudents.size > 0 && (
                    <button onClick={createBatchCertificates} className="bg-green-500 text-white px-4 py-2 rounded">
                        Tạo Văn Bằng Hàng Loạt ({selectedStudents.size})
                    </button>
                )}

                {/* ✅ Chỉ hiển thị nút "Làm Mới" khi có bộ lọc */}
                {hasFilters && (
                    <button onClick={resetFilters} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Làm Mới
                    </button>
                )}
            </div>

            {/* Danh sách sinh viên */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">#</th>
                        <th className="border p-2">Mã SV</th>
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Khoa</th>
                        <th className="border p-2">Chuyên Ngành</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((sv, index) => (
                        <tr key={sv.id} className="hover:bg-gray-100">
                            <td className="border p-2 text-center">
                                <input type="checkbox" onChange={() => handleCheckboxChange(sv.id)} />
                            </td>
                            <td className="border p-2">{sv.maSV}</td>
                            <td className="border p-2">{sv.ten}</td>
                            <td className="border p-2">{sv.khoa}</td>
                            <td className="border p-2">{sv.chuyenNganh}</td>
                            <td className="border p-2 text-center">
                                <button onClick={() => createCertificate(sv.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                                    Tạo Văn Bằng
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateCertificate;
