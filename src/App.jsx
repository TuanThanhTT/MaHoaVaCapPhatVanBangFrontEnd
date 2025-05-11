import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./page/user/Home";
import About from "./page/user/Home";
import LayoutUser from "./components/layout/LayoutUser";
import Contact from "./page/user/Contact";
import ImageUpload from "./page/user/ImageUpload";
import Dashboard from "./page/admin/Dashboard ";
import AcademicYearPage from "./page/admin/AcademicYearPage ";
import AdminLayout from "./components/layout/AdminLayout ";
import Faculty from "./page/admin/Faculty";
import StudentManagement from "./page/admin/StudentManagement";
import CreateCertificate from "./page/admin/CreateCertificate";
import VerifyCertificate from "./page/admin/VerifyCertificate";
import Department from "./page/admin/Department";
import AccountManagement from "./page/admin/AccountManagement";
import RolePermissionManagement from "./page/admin/RolePermissionManagement";
import ReviewCertificate from "./page/admin/ReviewCertificate";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import { jwtDecode } from 'jwt-decode';
import ViewDiploma from "./page/user/ViewDiploma";
import ViewDiplomaImages from "./page/user/ViewDiplomaImages";
import DiplomaQueryHistory from "./page/admin/DiplomaQueryHistory";
import ChangePassword from "./components/ChangePassword";

// Component bảo vệ route admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const isAdmin = decoded.roles.includes('ROLE_ADMINISTRATOR') || decoded.roles.includes('ROLE_ADMIN');
    return isAdmin ? children : <Navigate to="/" />;
  } catch (error) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" />;
  }
};

// Component bảo vệ route yêu cầu đăng nhập (cho cả admin và non-admin)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return <Navigate to="/login" />;

  try {
    jwtDecode(token); // Chỉ kiểm tra token hợp lệ
    return children;
  } catch (error) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" />;
  }
};

// Component ngăn truy cập trang login/reset-password nếu đã đăng nhập
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const isAdmin = decoded.roles.includes('ROLE_ADMINISTRATOR') || decoded.roles.includes('ROLE_ADMIN');
      return isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/" />;
    } catch (error) {
      localStorage.removeItem('jwtToken');
    }
  }
  return children;
};

// Component chọn layout dựa trên vai trò
const ChangePasswordRoute = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const isAdmin = decoded.roles.includes('ROLE_ADMINISTRATOR') || decoded.roles.includes('ROLE_ADMIN');
    return isAdmin ? (
      <AdminLayout><ChangePassword /></AdminLayout>
    ) : (
      <LayoutUser><ChangePassword /></LayoutUser>
    );
  } catch (error) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes cho người dùng thông thường */}
        <Route path="/" element={<LayoutUser><Home /></LayoutUser>} />
        <Route path="/About" element={<LayoutUser><About /></LayoutUser>} />
        <Route path="/Contact" element={<LayoutUser><Contact /></LayoutUser>} />
        <Route path="/ImageUpload" element={<LayoutUser><ImageUpload /></LayoutUser>} />
        <Route path="/tra-cuu" element={<LayoutUser><ViewDiploma /></LayoutUser>} />
        <Route path="/xem-van-bang" element={<LayoutUser><ViewDiplomaImages /></LayoutUser>} />

        {/* Route cho trang đăng nhập */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Route cho đặt lại mật khẩu */}
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Route cho đổi mật khẩu */}
        <Route
          path="/change-password"
          element={
            <AuthRoute>
              <ChangePasswordRoute />
            </AuthRoute>
          }
        />

        {/* Routes cho admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/faculty"
          element={
            <ProtectedRoute>
              <AdminLayout><Faculty /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/students"
          element={
            <ProtectedRoute>
              <AdminLayout><StudentManagement /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diploma/create"
          element={
            <ProtectedRoute>
              <AdminLayout><CreateCertificate /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diploma/verify"
          element={
            <ProtectedRoute>
              <AdminLayout><VerifyCertificate /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diploma/review"
          element={
            <ProtectedRoute>
              <AdminLayout><ReviewCertificate /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/manage"
          element={
            <ProtectedRoute>
              <AdminLayout><AccountManagement /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/roles"
          element={
            <ProtectedRoute>
              <AdminLayout><RolePermissionManagement /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity/search"
          element={
            <ProtectedRoute>
              <AdminLayout><DiplomaQueryHistory /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/faculty/:facultyId/departments"
          element={
            <ProtectedRoute>
              <AdminLayout><DepartmentWrapper /></AdminLayout>
            </ProtectedRoute>
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