import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Tạo instance Axios với baseURL
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    config => {

        const token = localStorage.getItem("jwtToken");
        console.log("Sending request to:", config.url);
        console.log("With token:", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Headers:", config.headers);
        }
        return config;
    },
    error => Promise.reject(error)
);



// Xử lý lỗi response
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Ngăn chuyển hướng lặp và chỉ xóa token nếu không ở trang login
            if (window.location.pathname !== "/login") {
                console.warn("Lỗi 401: Token không hợp lệ hoặc thiếu, chuyển hướng đến login");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } else {
            console.error("Lỗi API:", error.response?.data || error.message); // Debug
        }
        return Promise.reject(error);
    }
);

const Dashboard = () => {
    const [dataVanBang, setDataVanBang] = useState([]);
    const [dataLoaiTotNghiep, setDataLoaiTotNghiep] = useState([]);
    const [data, setData] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [filters, setFilters] = useState({
        academicYear: "",
        faculty: "",
        major: ""
    });
    const [error, setError] = useState(null);
    const colors = ["#006400", "#DC143C", "#00008B"];
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                const [academicYearsRes, facultiesRes, vanBangRes, loaiTotNghiepRes] = await Promise.all([
                    apiClient.get("/admin/degree/academic-years").catch(() => ({ data: [] })),
                    apiClient.get("/admin/faculty/all").catch(() => ({ data: { content: [] } })),
                    apiClient.get("/admin/degree/by-year").catch(() => ({ data: [] })),
                    apiClient.get("/admin/degree/by-classification").catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setAcademicYears(academicYearsRes.data);
                    setFaculties(facultiesRes.data.content);
                    setDataVanBang(vanBangRes.data);
                    setDataLoaiTotNghiep(loaiTotNghiepRes.data);
                    setError(null);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Lỗi khi lấy dữ liệu ban đầu:", error.response?.data || error.message);
                    setError("Không thể tải dữ liệu. Vui lòng thử lại.");
                }
            }
        };

        fetchInitialData();
        fetchDegrees();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (filters.faculty) {
            apiClient.get(`/admin/major/getall/${filters.faculty}`)
                .then(response => setMajors(response.data.content))
                .catch(error => {
                    console.error("Lỗi khi lấy danh sách chuyên ngành:", error.response?.data || error.message);
                    setError("Không thể tải danh sách chuyên ngành.");
                });
        } else {
            setMajors([]);
        }
    }, [filters.faculty]);

    const fetchDegrees = async (page = 0, size = 10) => {
        const params = {
            page,
            size,
            academicYear: filters.academicYear || undefined,
            major: filters.major || undefined
        };

        try {
            const response = await apiClient.get("/admin/degree/list", { params });
            setData(response.data.content);
            setError(null);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách văn bằng:", error.response?.data || error.message);
            setError("Không thể tải danh sách văn bằng.");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            ...(name === "faculty" && { major: "" })
        }));
    };

    const handleSearch = () => {
        fetchDegrees();
    };

    const exportToExcel = async () => {
        const params = {
            academicYear: filters.academicYear || undefined,
            major: filters.major || undefined
        };

        try {
            const response = await apiClient.get("/admin/degree/export-excel", {
                params,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'DanhSachVanBang.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setError(null);
        } catch (error) {
            console.error("Lỗi khi xuất file Excel:", error.response?.data || error.message);
            setError("Không thể xuất file Excel.");
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="flex flex-wrap gap-2 md:gap-4 p-4 bg-gray-100 rounded-lg">
                <select
                    name="academicYear"
                    value={filters.academicYear}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full md:w-auto"
                >
                    <option value="">Chọn năm học</option>
                    {academicYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    name="faculty"
                    value={filters.faculty}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full md:w-auto"
                >
                    <option value="">Chọn khoa</option>
                    {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>{faculty.facultyName}</option>
                    ))}
                </select>
                <select
                    name="major"
                    value={filters.major}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full md:w-auto"
                    disabled={!filters.faculty}
                >
                    <option value="">Chọn chuyên ngành</option>
                    {majors.map(major => (
                        <option key={major.idMajor} value={major.idMajor}>{major.majorName}</option>
                    ))}
                </select>
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Tỉ lệ loại văn bằng</h2>
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
                                    <td className="border p-2">{row.studentId}</td>
                                    <td className="border p-2">{row.fullName}</td>
                                    <td className="border p-2">{row.majorName}</td>
                                    <td className="border p-2">{row.degreeClassification}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={exportToExcel}
                    className="bg-green-500 text-white px-4 py-2 mt-2 rounded w-full md:w-auto"
                >
                    Xuất Excel
                </button>
            </div>
        </div>
    );
};

export default Dashboard;