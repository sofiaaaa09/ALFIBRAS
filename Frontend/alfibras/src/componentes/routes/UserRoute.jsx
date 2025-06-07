import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/iniciar-sesion" />;

  const decoded = JSON.parse(atob(token.split('.')[1]));

  return decoded.role === 'Usuario' ? <Outlet /> : <Navigate to="/admin" />;
};

export default UserRoute;
