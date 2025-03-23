// // import { useState } from "react";
// // import Modal from "react-modal";

// // const initialStudents = [
// //     {
// //         id: "SV001",
// //         name: "Nguyễn Văn A",
// //         faculty: "Công nghệ thông tin",
// //         major: "Khoa học máy tính",
// //         address: "123 Đường ABC, TP.HCM",
// //         hometown: "Hà Nội",
// //         year: "2021-2025",
// //         gpa: 3.8,
// //         dob: "2003-01-01",
// //         class: "CNTT-K45",
// //         ranking: "Giỏi",
// //         phone: "0987654321",
// //         email: "nguyenvana@gmail.com",
// //         nationality: "Việt Nam",
// //     },
// // ];

// // Modal.setAppElement("#root");

// // export default function StudentManagement() {
// //     const [search, setSearch] = useState("");
// //     const [facultyFilter, setFacultyFilter] = useState("");
// //     const [majorFilter, setMajorFilter] = useState("");
// //     const [students, setStudents] = useState(initialStudents);
// //     const [showModal, setShowModal] = useState(false);
// //     const [selectedStudent, setSelectedStudent] = useState(null);
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [newStudent, setNewStudent] = useState({
// //         id: "",
// //         name: "",
// //         faculty: "",
// //         major: "",
// //         address: "",
// //         hometown: "",
// //         year: "",
// //         gpa: "",
// //         dob: "",
// //         class: "",
// //         ranking: "",
// //         phone: "",
// //         email: "",
// //         nationality: "",
// //     });

// //     const handleOpenModal = (student = null) => {
// //         setIsEditing(!!student);
// //         setNewStudent(student || {
// //             id: "",
// //             name: "",
// //             faculty: "",
// //             major: "",
// //             address: "",
// //             hometown: "",
// //             year: "",
// //             gpa: "",
// //             dob: "",
// //             class: "",
// //             ranking: "",
// //             phone: "",
// //             email: "",
// //             nationality: "",
// //         });
// //         setShowModal(true);
// //     };

// //     return (
// //         <div className="p-6">
// //             <h1 className="text-2xl font-bold mb-4">Quản lý sinh viên</h1>
// //             <div className="flex items-center gap-2 mb-4">
// //                 <input
// //                     type="text"
// //                     placeholder="Tìm kiếm theo mã hoặc tên sinh viên..."
// //                     className="border p-2 rounded w-full"
// //                     value={search}
// //                     onChange={(e) => setSearch(e.target.value)}
// //                 />
// //                 <button className="bg-blue-500 text-white px-4 py-2 rounded">Tìm</button>
// //             </div>
// //             <div className="flex gap-4 mb-4">
// //                 <select className="border p-2 rounded w-1/3" value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
// //                     <option value="">Tất cả khoa</option>
// //                     <option value="Công nghệ thông tin">Công nghệ thông tin</option>
// //                     <option value="Kinh tế">Kinh tế</option>
// //                 </select>
// //                 <select className="border p-2 rounded w-1/3" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
// //                     <option value="">Tất cả chuyên ngành</option>
// //                     <option value="Khoa học máy tính">Khoa học máy tính</option>
// //                     <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
// //                 </select>
// //             </div>
// //             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => handleOpenModal()}>
// //                 Thêm sinh viên
// //             </button>
// //             <table className="border-collapse border border-gray-300 w-full">
// //                 <thead>
// //                     <tr className="bg-gray-200">
// //                         <th className="border p-2">Mã SV</th>
// //                         <th className="border p-2">Họ và tên</th>
// //                         <th className="border p-2">Khoa</th>
// //                         <th className="border p-2">Chuyên ngành</th>
// //                         <th className="border p-2">Lớp</th>
// //                         <th className="border p-2">GPA</th>
// //                         <th className="border p-2">Hành động</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {students.map((student) => (
// //                         <tr key={student.id}>
// //                             <td className="border p-2">{student.id}</td>
// //                             <td className="border p-2">{student.name}</td>
// //                             <td className="border p-2">{student.faculty}</td>
// //                             <td className="border p-2">{student.major}</td>
// //                             <td className="border p-2">{student.class}</td>
// //                             <td className="border p-2">{student.gpa}</td>
// //                             <td className="border p-2">
// //                                 <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenModal(student)}>
// //                                     Xem
// //                                 </button>
// //                                 <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenModal(student)}>
// //                                     Sửa
// //                                 </button>
// //                                 <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenModal(student)}>
// //                                     Xóa
// //                                 </button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>

// //             <Modal
// //                 isOpen={showModal}
// //                 onRequestClose={() => setShowModal(false)}
// //                 className="bg-white p-6 rounded-lg max-w-lg mx-auto"
// //                 overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
// //             >
// //                 <h2 className="text-xl font-bold mb-4">{isEditing ? "Sửa" : "Thêm"} sinh viên</h2>
// //                 <label>Mã sinh viên</label>
// //                 <input className="border p-2 w-full mb-2" placeholder="Mã SV" value={newStudent.id} onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })} />
// //                 <label>Họ tên</label>
// //                 <input className="border p-2 w-full mb-2" placeholder="Họ và tên" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
// //                 <label>Năm sinh</label>
// //                 <input className="border p-2 w-full mb-2" placeholder="Năm sinh" value={newStudent.id} onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })} />
// //                 <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Lưu</button>
// //             </Modal>
// //         </div>
// //     );
// // }


// import { useState } from "react";
// import Modal from "react-modal";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { registerLocale } from "react-datepicker";
// import vi from "date-fns/locale/vi";


// const initialStudents = [
//     {
//         id: "SV001",
//         name: "Nguyễn Văn A",
//         faculty: "Công nghệ thông tin",
//         major: "Khoa học máy tính",
//         address: "123 Đường ABC, TP.HCM",
//         hometown: "Hà Nội",
//         year: "2021-2025",
//         gpa: 3.8,
//         dob: "2003-01-01",
//         class: "CNTT-K45",
//         ranking: "Giỏi",
//         phone: "0987654321",
//         email: "nguyenvana@gmail.com",
//         nationality: "Việt Nam",
//     },
// ];

// Modal.setAppElement("#root");

// export default function StudentManagement() {
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [search, setSearch] = useState("");
//     const [facultyFilter, setFacultyFilter] = useState("");
//     const [majorFilter, setMajorFilter] = useState("");
//     const [students, setStudents] = useState(initialStudents);
//     const [selectedStudent, setSelectedStudent] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [newStudent, setNewStudent] = useState({
//         id: "",
//         name: "",
//         faculty: "",
//         major: "",
//         address: "",
//         hometown: "",
//         year: "",
//         gpa: "",
//         dob: "",
//         class: "",
//         ranking: "",
//         phone: "",
//         email: "",
//         nationality: "",
//     });

//     const handleOpenAddModal = () => {
//         setNewStudent({
//             id: "",
//             name: "",
//             faculty: "",
//             major: "",
//             address: "",
//             hometown: "",
//             year: "",
//             gpa: "",
//             dob: "",
//             class: "",
//             ranking: "",
//             phone: "",
//             email: "",
//             nationality: "",
//         });
//         setShowAddModal(true);
//     };

//     const handleOpenEditModal = (student) => {
//         setSelectedStudent(student);
//         setNewStudent(student);
//         setShowEditModal(true);
//     };


//     return (

//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Quản lý sinh viên</h1>
//             <div className="flex items-center gap-2 mb-4">
//                 <input
//                     type="text"
//                     placeholder="Tìm kiếm theo mã hoặc tên sinh viên..."
//                     className="border p-2 rounded w-full"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded">Tìm</button>
//             </div>
//             <div className="flex gap-4 mb-4">
//                 <select className="border p-2 rounded w-1/3" value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
//                     <option value="">Tất cả khoa</option>
//                     <option value="Công nghệ thông tin">Công nghệ thông tin</option>
//                     <option value="Kinh tế">Kinh tế</option>
//                 </select>
//                 <select className="border p-2 rounded w-1/3" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
//                     <option value="">Tất cả chuyên ngành</option>
//                     <option value="Khoa học máy tính">Khoa học máy tính</option>
//                     <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
//                 </select>
//             </div>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={handleOpenAddModal}>
//                 Thêm sinh viên
//             </button>
//             <table className="border-collapse border border-gray-300 w-full">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="border p-2">Mã SV</th>
//                         <th className="border p-2">Họ và tên</th>
//                         <th className="border p-2">Khoa</th>
//                         <th className="border p-2">Chuyên ngành</th>
//                         <th className="border p-2">Lớp</th>
//                         <th className="border p-2">GPA</th>
//                         <th className="border p-2">Hành động</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((student) => (
//                         <tr key={student.id}>
//                             <td className="border p-2">{student.id}</td>
//                             <td className="border p-2">{student.name}</td>
//                             <td className="border p-2">{student.faculty}</td>
//                             <td className="border p-2">{student.major}</td>
//                             <td className="border p-2">{student.class}</td>
//                             <td className="border p-2">{student.gpa}</td>
//                             <td className="border p-2">
//                                 <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenModal(student)}>
//                                     Xem
//                                 </button>
//                                 <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenEditModal(student)}>
//                                     Sửa
//                                 </button>
//                                 <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => handleOpenModal(student)}>
//                                     Xóa
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>







//             <Modal
//                 isOpen={showAddModal}
//                 onRequestClose={() => setShowAddModal(false)}
//                 className="bg-white p-6 rounded-lg w-[70%] mx-auto"
//                 overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//             >
//                 <div className="bg-blue-500 text-white p-2 rounded-sm">
//                     <h2 className="text-xl font-bold mb-4 mt-2">Thêm sinh viên</h2>

//                 </div>
//                 <hr className="mb-8"></hr>

//                 <div className="grid grid-cols-2  gap-4">
//                     {Object.keys(newStudent).map((key) => (
//                         <div key={key}>
//                             <label className="block font-medium">{key}</label>
//                             <input
//                                 className="border p-2 w-full rounded"
//                                 placeholder={key}
//                                 value={newStudent[key]}
//                                 onChange={(e) => setNewStudent({ ...newStudent, [key]: e.target.value })}
//                             />
//                         </div>
//                     ))}
//                 </div>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={() => setShowAddModal(false)}>
//                     Lưu
//                 </button>
//             </Modal>

//             <Modal
//                 isOpen={showEditModal}
//                 onRequestClose={() => setShowEditModal(false)}
//                 className="bg-white p-6 rounded-lg w-[80%] mx-auto"
//                 overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//             >
//                 <div className="bg-blue-500 text-white p-2 rounded-sm">

//                     <h2 className="text-xl font-bold mb-4 mt-2">Sửa sinh viên</h2>
//                 </div>

//                 <hr className="mb-8"></hr>
//                 <div className="grid grid-cols-2 gap-4">

//                     <div>
//                         <label className="block font-medium">Mã sinh viên</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="mã sinh viên"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">Tên sinh viên</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Tên sinh viên"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Ngày sinh</label>
//                         <DatePicker
//                             selected={selectedDate}
//                             onChange={(date) => setSelectedDate(date)}
//                             dateFormat="dd/MM/yyyy"
//                             locale="vi"
//                             placeholderText="Chọn ngày (dd/MM/yyyy)"
//                             wrapperClassName="w-full"
//                             className="border p-2 w-full rounded"
//                         />

//                     </div>

//                     <div>
//                         <label className="block font-medium">Khoa</label>
//                         <select
//                             className="border p-2 w-full rounded"
//                         >
//                             <option value="">Chọn khoa</option>
//                             <option value="Công nghệ thông tin">Công nghệ thông tin</option>
//                             <option value="Kinh tế">Kinh tế</option>
//                             <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
//                             <option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</option>
//                         </select>

//                     </div>

//                     <div>
//                         <label className="block font-medium">Chuyên ngành</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Chuyên ngành"

//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">Tên lớp</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Tên lớp"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Dân tộc</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Dân tộc"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Đại chỉ</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Địa chỉ"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Quốc tịch</label>
//                         <input
//                             className="border p-2 w-full rounded"
//                             placeholder="Quốc tịch"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Quê quán</label>
//                         <select
//                             className="border p-2 w-full rounded"
//                         >
//                             <option value="">Chọn quê quán</option>
//                             <option value="Hà Nội">Hà Nội</option>
//                             <option value="TP.HCM">TP.HCM</option>
//                             <option value="Đà Nẵng">Đà Nẵng</option>
//                             <option value="Cần Thơ">Cần Thơ</option>
//                             <option value="Hải Phòng">Hải Phòng</option>
//                         </select>

//                     </div>




//                     <div>
//                         <label className="block font-medium">Số điện thoại</label>
//                         <input

//                             className="border p-2 w-full rounded"
//                             placeholder="Số điện thoại"

//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium">Email</label>
//                         <input
//                             type="email"
//                             className="border p-2 w-full rounded"
//                             placeholder="email"

//                         />
//                     </div>

//                 </div>
//                 <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={() => setShowEditModal(false)}>
//                     Lưu
//                 </button>
//             </Modal>
//         </div>
//     );
// }



import { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, EyeIcon } from "@heroicons/react/24/solid";

registerLocale("vi", vi);
Modal.setAppElement("#root");

export default function StudentManagement() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [search, setSearch] = useState("");
    const [facultyFilter, setFacultyFilter] = useState("");
    const [majorFilter, setMajorFilter] = useState("");
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        fullName: "",
        birthDay: "",
        majorId: "",
        className: "",
        address: "",
        ethnicity: "",
        nationality: "",
        phoneNumber: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/faculty/all");
                setFaculties(response.data.content);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khoa:", error);
            }
        };

        const fetchMajors = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/major/all");
                setMajors(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ngành:", error);
            }
        };

        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/admin/student/all?page=0&size=10");
                const studentData = response.data.content.map(student => ({
                    id: student.id.toString(),
                    name: student.fullName,
                    facultyId: student.major?.faculty?.id || "",
                    faculty: student.major?.faculty?.facultyName || "Chưa xác định",
                    majorId: student.major?.idMajor || "",
                    major: student.major?.majorName || "Chưa xác định",
                    address: student.address,
                    hometown: student.nationality,
                    year: "2021-2025",
                    gpa: "N/A",
                    dob: student.birthDay,
                    class: student.className,
                    ranking: "N/A",
                    phone: student.phoneNumber,
                    email: student.email,
                    nationality: student.nationality,
                }));
                setStudents(studentData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sinh viên:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaculties();
        fetchMajors();
        fetchStudents();
    }, []);

    const handleOpenAddModal = () => {
        setNewStudent({
            fullName: "",
            birthDay: "",
            majorId: "",
            className: "",
            address: "",
            ethnicity: "",
            nationality: "",
            phoneNumber: "",
            email: "",
        });
        setSelectedDate(null); // Reset DatePicker
        setShowAddModal(true);
    };

    const handleOpenEditModal = (student) => {
        setSelectedStudent(student);
        setNewStudent({
            fullName: student.name,
            birthDay: student.dob,
            majorId: student.majorId,
            className: student.class,
            address: student.address,
            ethnicity: "Kinh", // Giả sử mặc định
            nationality: student.nationality,
            phoneNumber: student.phone,
            email: student.email,
        });
        setSelectedDate(student.dob ? new Date(student.dob) : null); // Cập nhật DatePicker
        setShowEditModal(true);
    };

    const handleSaveStudent = async () => {
        if (!newStudent.fullName || !newStudent.birthDay || !newStudent.majorId) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc: Họ và tên, Ngày sinh, Chuyên ngành!");
            return;
        }

        setIsLoading(true);
        try {
            const studentToSave = {
                fullName: newStudent.fullName,
                birthDay: newStudent.birthDay,
                major: { idMajor: parseInt(newStudent.majorId) }, // Gửi major dưới dạng object
                className: newStudent.className,
                address: newStudent.address,
                ethnicity: newStudent.ethnicity || "Kinh", // Mặc định nếu không nhập
                nationality: newStudent.nationality || "Việt Nam", // Mặc định nếu không nhập
                phoneNumber: newStudent.phoneNumber,
                email: newStudent.email,
                isDelete: false,
            };

            const response = await axios.post("http://localhost:8080/admin/student/add", studentToSave, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200 || response.status === 201) {
                setShowAddModal(false);
                setIsSuccessModalOpen(true);

                // Cập nhật lại danh sách sinh viên
                const studentsResponse = await axios.get("http://localhost:8080/admin/student/all?page=0&size=10");
                const studentData = studentsResponse.data.content.map(student => ({
                    id: student.id.toString(),
                    name: student.fullName,
                    facultyId: student.major?.faculty?.id || "",
                    faculty: student.major?.faculty?.facultyName || "Chưa xác định",
                    majorId: student.major?.idMajor || "",
                    major: student.major?.majorName || "Chưa xác định",
                    address: student.address,
                    hometown: student.nationality,
                    year: "2021-2025",
                    gpa: "N/A",
                    dob: student.birthDay,
                    class: student.className,
                    ranking: "N/A",
                    phone: student.phoneNumber,
                    email: student.email,
                    nationality: student.nationality,
                }));
                setStudents(studentData);

                setTimeout(() => setIsSuccessModalOpen(false), 2000);
            }
        } catch (error) {
            console.error("Lỗi khi thêm sinh viên:", error);
            alert("Có lỗi xảy ra khi thêm sinh viên: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Quản lý Sinh Viên</h1>

            {/* Thanh tìm kiếm và lọc */}
            <div className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc tên sinh viên..."
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={isLoading}
                />
                <motion.button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Tìm
                </motion.button>
            </div>

            <div className="flex gap-4 mb-6">
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                >
                    <option value="">Tất cả khoa</option>
                    {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>
                            {faculty.facultyName} (ID: {faculty.id})
                        </option>
                    ))}
                </select>
                <select
                    className="w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={majorFilter}
                    onChange={(e) => setMajorFilter(e.target.value)}
                >
                    <option value="">Tất cả chuyên ngành</option>
                    {majors.map(major => (
                        <option key={major.idMajor} value={major.idMajor}>
                            {major.majorName} (ID: {major.idMajor})
                        </option>
                    ))}
                </select>
                <motion.button
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-green-600 hover:to-teal-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenAddModal}
                    disabled={isLoading}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Thêm Sinh Viên
                </motion.button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full border bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <tr>
                            <th className="p-3">Mã SV</th>
                            <th className="p-3">Họ và tên</th>
                            <th className="p-3">Mã Khoa</th>
                            <th className="p-3">Mã Ngành</th>
                            <th className="p-3">Lớp</th>

                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {isLoading ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="7" className="p-3 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </motion.tr>
                            ) : students.length > 0 ? (
                                students.map((student) => (
                                    <motion.tr
                                        key={student.id}
                                        className="border-b hover:bg-gray-100 transition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <td className="p-3 text-center font-semibold text-blue-600">{student.id}</td>
                                        <td className="p-3 text-center">{student.name}</td>
                                        <td className="p-3 text-center">{student.facultyId || "N/A"}</td>
                                        <td className="p-3 text-center">{student.majorId || "N/A"}</td>
                                        <td className="p-3 text-center">{student.class}</td>

                                        <td className="p-3 flex justify-center gap-2">
                                            <motion.button
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-blue-600 hover:to-indigo-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenEditModal(student)}
                                            >
                                                <EyeIcon className="w-5 h-5 mr-1" /> Xem
                                            </motion.button>
                                            <motion.button
                                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-yellow-600 hover:to-orange-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenEditModal(student)}
                                            >
                                                <PencilSquareIcon className="w-5 h-5 mr-1" /> Sửa
                                            </motion.button>
                                            <motion.button
                                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg flex items-center shadow hover:from-red-600 hover:to-pink-600"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenEditModal(student)}
                                            >
                                                <TrashIcon className="w-5 h-5 mr-1" /> Xóa
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="7" className="p-3 text-center text-gray-500">
                                        Không tìm thấy sinh viên
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm Sinh Viên */}
            <Modal
                isOpen={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
                className="bg-white p-6 rounded-lg w-[70%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Thêm Sinh Viên</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Họ và tên</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.fullName}
                            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Ngày sinh</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                setNewStudent({ ...newStudent, birthDay: date.toISOString().split("T")[0] });
                            }}
                            dateFormat="yyyy-MM-dd"
                            locale="vi"
                            placeholderText="Chọn ngày (yyyy-MM-dd)"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Chuyên ngành</label>
                        <select
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.majorId}
                            onChange={(e) => setNewStudent({ ...newStudent, majorId: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="">Chọn chuyên ngành</option>
                            {majors.map(major => (
                                <option key={major.idMajor} value={major.idMajor}>
                                    {major.majorName} (ID: {major.idMajor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Tên lớp</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.className}
                            onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Địa chỉ</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.address}
                            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Dân tộc</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.ethnicity}
                            onChange={(e) => setNewStudent({ ...newStudent, ethnicity: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quốc tịch</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.nationality}
                            onChange={(e) => setNewStudent({ ...newStudent, nationality: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Số điện thoại</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.phoneNumber}
                            onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        className={`bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-teal-600"}`}
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        onClick={handleSaveStudent}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Lưu"}
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Sửa Sinh Viên */}
            <Modal
                isOpen={showEditModal}
                onRequestClose={() => setShowEditModal(false)}
                className="bg-white p-6 rounded-lg w-[80%] mx-auto shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Sửa Sinh Viên</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label className="block font-medium text-gray-700">Họ và tên</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.fullName}
                            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Ngày sinh</label>
                        <DatePicker
                            selected={selectedDate || (newStudent.birthDay ? new Date(newStudent.birthDay) : null)}
                            onChange={(date) => {
                                setSelectedDate(date);
                                setNewStudent({ ...newStudent, birthDay: date.toISOString().split("T")[0] });
                            }}
                            dateFormat="yyyy-MM-dd"
                            locale="vi"
                            placeholderText="Chọn ngày (yyyy-MM-dd)"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Chuyên ngành</label>
                        <select
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.majorId}
                            onChange={(e) => setNewStudent({ ...newStudent, majorId: e.target.value })}
                        >
                            <option value="">Chọn chuyên ngành</option>
                            {majors.map(major => (
                                <option key={major.idMajor} value={major.idMajor}>
                                    {major.majorName} (ID: {major.idMajor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Tên lớp</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.className}
                            onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Địa chỉ</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.address}
                            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Dân tộc</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.ethnicity}
                            onChange={(e) => setNewStudent({ ...newStudent, ethnicity: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Quốc tịch</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.nationality}
                            onChange={(e) => setNewStudent({ ...newStudent, nationality: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Số điện thoại</label>
                        <input
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.phoneNumber}
                            onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4">
                    <motion.button
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(false)}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(false)}
                    >
                        Lưu
                    </motion.button>
                </div>
            </Modal>

            {/* Modal Thông Báo Thành Công */}
            <Modal
                isOpen={isSuccessModalOpen}
                onRequestClose={() => setIsSuccessModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg w-[30%] mx-auto mt-40"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Thêm sinh viên thành công!</h2>
                    <div className="flex justify-center">
                        <motion.button
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSuccessModalOpen(false)}
                        >
                            Đóng
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
}