import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/iniciar-sesion" />;

  const decoded = JSON.parse(atob(token.split('.')[1]));

  return decoded.role === 'admin' ? <Outlet /> : <Navigate to="/productos" />;
};

export default AdminRoute;
