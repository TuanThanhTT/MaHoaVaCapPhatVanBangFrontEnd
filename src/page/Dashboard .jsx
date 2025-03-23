import { useState } from "react";

import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import * as XLSX from "xlsx";

const Dashboard = () => {
    const dataVanBang = [
        { nam: "2021", soLuong: 500 },
        { nam: "2022", soLuong: 600 },
        { nam: "2023", soLuong: 700 },
    ];

    const dataLoaiTotNghiep = [
        { name: "Giỏi", value: 300 },
        { name: "Khá", value: 400 },
        { name: "Trung bình", value: 200 },
    ];

    const colors = ["#006400", "#DC143C", "#00008B"]; // Xanh lá đậm - Đỏ hơi hồng - Xanh đậm








    const [data, setData] = useState([
        { maSV: "SV001", tenSV: "Nguyễn Văn A", chuyenNganh: "CNTT", loaiTotNghiep: "Giỏi" },
        { maSV: "SV002", tenSV: "Trần Thị B", chuyenNganh: "QTKD", loaiTotNghiep: "Khá" },
        { maSV: "SV003", tenSV: "Lê Văn C", chuyenNganh: "Kế Toán", loaiTotNghiep: "Trung bình" },
    ]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DanhSachVanBang");
        XLSX.writeFile(wb, "DanhSachVanBang.xlsx");
    };

    return (

        <div className="p-4 bg-white shadow-lg rounded-lg">
            {/* Bộ lọc dữ liệu */}
            <div className="flex flex-wrap gap-2 md:gap-4 p-4 bg-gray-100 rounded-lg">
                <select className="border p-2 rounded w-full md:w-auto">
                    <option value="">Chọn năm</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <select className="border p-2 rounded w-full md:w-auto">
                    <option value="">Chuyên ngành</option>
                    <option value="CNTT">Công nghệ thông tin</option>
                    <option value="QTKD">Quản trị kinh doanh</option>
                </select>
                <input type="text" placeholder="Nhập mã sinh viên" className="border p-2 rounded w-full md:w-64" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">Tìm kiếm</button>
            </div>

            {/* Biểu đồ thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Biểu đồ cột */}
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Số lượng văn bằng theo năm</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataVanBang}>
                            <XAxis dataKey="nam" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="soLuong" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ tròn */}
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Tỉ lệ loại tốt nghiệp</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dataLoaiTotNghiep}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {dataLoaiTotNghiep.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bảng danh sách văn bằng */}
            <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Danh sách văn bằng</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Mã SV</th>
                                <th className="border p-2">Tên Sinh Viên</th>
                                <th className="border p-2">Chuyên Ngành</th>
                                <th className="border p-2">Loại Tốt Nghiệp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{row.maSV}</td>
                                    <td className="border p-2">{row.tenSV}</td>
                                    <td className="border p-2">{row.chuyenNganh}</td>
                                    <td className="border p-2">{row.loaiTotNghiep}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 mt-2 rounded w-full md:w-auto">
                    Xuất Excel
                </button>
            </div>
        </div>

    );
};

export default Dashboard;
