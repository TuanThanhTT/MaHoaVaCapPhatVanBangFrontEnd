
import { BrowserRouter, Router, Routes, Route, useParams } from "react-router-dom"
import Home from "./page/Home"
import About from "./page/About"
import LayoutUser from "./components/LayoutUser"
import Contact from "./page/Contact"
import ImageUpload from "./page/ImageUpload"

import Dashboard from "./page/Dashboard "
import AcademicYearPage from "./page/AcademicYearPage "
import AdminLayout from "./components/AdminLayout "
import Faculty from "./page/Faculty"

import StudentManagement from "./page/StudentManagement"
import CreateCertificate from "./page/CreateCertificate"
import VerifyCertificate from "./page/VerifyCertificate"
import Department from "./page/Department"


// function App() {

//   return (
//     <>
//       <BrowserRouter>

//         {/* <Routes>
//           <Route path="/" element={<LayoutUser><Home /></LayoutUser>} />
//           <Route path="/about" element={<LayoutUser><About /></LayoutUser>} />
//           <Route path="/contact" element={<LayoutUser><Contact /></LayoutUser>} />
//           <Route path="/ImageUpload" element={<LayoutUser><ImageUpload /></LayoutUser>} />

//         </Routes> */}
//         <Routes>
//           <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
//           <Route path="/settings/academic-year" element={<AdminLayout><AcademicYearPage /></AdminLayout>} />
//           <Route path="/settings/faculty" element={<AdminLayout><Faculty /></AdminLayout>} />
//           <Route path="/settings/students" element={<AdminLayout><StudentManagement /></AdminLayout>} />

//           <Route path="/diploma/create" element={<AdminLayout>
//             <CreateCertificate />
//           </AdminLayout>
//           } />
//           <Route path="/diploma/verify" element={
//             <AdminLayout>
//               <VerifyCertificate />

//             </AdminLayout>

//           } />
//         </Routes>

//       </BrowserRouter>

//     </>
//   )
// }

// export default App


function App() {
  return (
    <BrowserRouter>
      {/* Routes cho người dùng thông thường (hiện bị comment) */}
      {/* <Routes>
        <Route path="/" element={<LayoutUser><Home /></LayoutUser>} />
        <Route path="/about" element={<LayoutUser><About /></LayoutUser>} />
        <Route path="/contact" element={<LayoutUser><Contact /></LayoutUser>} />
        <Route path="/ImageUpload" element={<LayoutUser><ImageUpload /></LayoutUser>} />
      </Routes> */}

      {/* Routes cho admin */}
      <Routes>
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route
          path="/settings/academic-year"
          element={<AdminLayout><AcademicYearPage /></AdminLayout>}
        />
        <Route
          path="/settings/faculty"
          element={<AdminLayout><Faculty /></AdminLayout>}
        />
        <Route
          path="/settings/students"
          element={<AdminLayout><StudentManagement /></AdminLayout>}
        />
        <Route
          path="/diploma/create"
          element={
            <AdminLayout>
              <CreateCertificate />
            </AdminLayout>
          }
        />
        <Route
          path="/diploma/verify"
          element={
            <AdminLayout>
              <VerifyCertificate />
            </AdminLayout>
          }
        />
        {/* Thêm route cho Department */}
        <Route
          path="/settings/faculty/:facultyId/departments"
          element={
            <AdminLayout>
              <DepartmentWrapper />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Component wrapper để truyền facultyId vào Department
const DepartmentWrapper = () => {
  const { facultyId } = useParams();
  return <Department facultyId={facultyId} />;
};

export default App;