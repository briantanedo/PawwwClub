import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" /> 
      ): (
        <>
          <section className="absolute w-screen xl:w-1/2 xl:left-1/2 h-screen fill-white flex justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img 
            src="/assets/images/auth-bg.svg"
            alt="logo"
            className="h-screen w-screen object-cover bg-repeat"
          />
        </>
      )}
    </>
  )
}

export default AuthLayout