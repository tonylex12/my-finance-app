import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false; // Asumiendo que tienes una función para verificar si el usuario está autenticado

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <img
            src="/assets/images/side-image.png"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
          <section className="flex flex-1 justify-center items-center flex-col py-10 bg-white">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
};
export default AuthLayout;
