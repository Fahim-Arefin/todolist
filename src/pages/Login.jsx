import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/Bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

function Login() {
  const [showPassword, setShowPassWord] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log("location in login page", location);

  const handleShowPassword = () => {
    setShowPassWord(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log(email, password);
    signIn(email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        toast.success("Email and password matched", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate(location?.state ? location.state : "/");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        toast.error(errorCode, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast.success("Email matched", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate(location?.state ? location.state : "/");
        }, 2000);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        toast.error(errorCode, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 min-h-screen">
      <div className="md:col-span-1 lg:col-span-2 h-[400px] lg:h-screen">
        <img className="w-full h-full" src="./login.svg" alt="" />
      </div>
      <div className="md:col-span-1 lg:col-span-1 flex justify-center items-center min-h-screen">
        <div className="h-[500px] flex flex-col space-y-6 p-4">
          <span className="text-xl text-slate-700 font-bold">
            Welcome to ProTasker 👋
          </span>
          <p className="text-sm text-gray-400 font-semibold">
            Please sign in to your account and start <br /> the advanture
          </p>
          <form onSubmit={handleLogin} className="flex flex-col space-y-4 ">
            <div>
              <input
                required
                className="border px-4 py-2 rounded-md w-full outline-none focus:border-gray-400 placeholder:text-gray-400
                text-slate-700"
                placeholder="Email"
                type="email"
                name="email"
              />
            </div>
            <div className="relative">
              <input
                required
                className="border px-4 py-2 rounded-md w-full outline-none focus:border-gray-400 placeholder:text-gray-400
                text-slate-700"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              {showPassword ? (
                <div className="absolute right-2 top-3">
                  <BiSolidShow
                    onClick={handleShowPassword}
                    className="text-xl cursor-pointer"
                  />
                </div>
              ) : (
                <div className="absolute right-2 top-3">
                  <BiSolidHide
                    onClick={handleShowPassword}
                    className="text-xl cursor-pointer"
                  />
                </div>
              )}
            </div>
            <div>
              <button className="px-4 py-2 rounded-md w-full outline-none text-white bg-[#aea1ea] active:bg-[#aea1ea] hover:bg-[#9a8ade]">
                Sign in
              </button>
            </div>
          </form>
          <div className="flex space-x-3 text-sm ">
            <span className="text-gray-400">New on our platform?</span>
            <Link to="/registration" className="text-[#8d79e6]">
              create an account
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="bg-gray-400 h-[1px] w-2/3"></div>
            <span className="w-1/5 text-center">or</span>
            <div className="bg-gray-400 h-[1px] w-2/3"></div>
          </div>
          <div>
            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2 rounded-md w-full outline-none hover:text-white border border-gray-700 hover:bg-gray-700 active:bg-gray-800"
            >
              <div className="flex space-x-2 justify-center">
                <FcGoogle className="text-2xl" />
                <span>Sign in with google</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          display: "inline-block",
          width: "auto",
        }}
      />
    </div>
  );
}

export default Login;
