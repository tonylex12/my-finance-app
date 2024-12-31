import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false; // Asumiendo que tienes una función para verificar si el usuario está autenticado

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section>
            <Outlet />
          </section>
        </>
      )}
    </>
  );
};
export default AuthLayout;
