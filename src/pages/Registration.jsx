import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidShow, BiSolidHide } from "react-icons/Bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../hooks/useAuth";

function hasCapitalLetter(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= "A" && str[i] <= "Z") {
      return true;
    }
  }
  return false;
}

function hasSpecialCharacter(str) {
  const specialCharacters = "!@#$%^&*()_+{}[]:;<>,.?~|";

  for (let i = 0; i < str.length; i++) {
    if (specialCharacters.includes(str[i])) {
      return true;
    }
  }
  return false;
}
function Registration() {
  const [showPassword, setShowPassWord] = useState(false);
  const { createUser, updateUserInfo } = useAuth();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassWord(!showPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const photo = e.target.photo.value;
    const password = e.target.password.value;

    console.log(name, photo, email, password);

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (!hasCapitalLetter(password)) {
      toast.error("don't have a capital letter", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (!hasSpecialCharacter(password)) {
      toast.error("don't have a special character", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      createUser(email, password)
        .then((userCredential) => {
          console.log(userCredential.user);
          updateUserInfo({
            displayName: name,
            photoURL: photo,
          })
            .then(() => {
              toast.success("Account created successfully", {
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
                navigate("/");
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
            });
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
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 min-h-screen">
        <div className="md:col-span-1 lg:col-span-2 flex items-center justify-center">
          <img className="w-[90%] h-[80%]" src="./registration.svg" alt="" />
        </div>
        <div className="md:col-span-1 lg:col-span-1 bg-white flex justify-center items-center ">
          <div className="h-[500px] flex flex-col space-y-6 p-4">
            <span className="text-xl text-slate-700 font-bold">
              Welcome to ProTasker 👋
            </span>
            <p className="text-sm text-gray-400 font-semibold">
              Please register in our platform and start <br /> the advanture
            </p>
            <form onSubmit={handleRegister} className="flex flex-col space-y-4">
              <div>
                <input
                  required
                  className="border px-4 py-2 rounded-md w-full outline-none focus:border-gray-400 placeholder:text-gray-400
                text-slate-700"
                  placeholder="name"
                  type="text"
                  name="name"
                />
              </div>
              <div>
                <input
                  required
                  className="border px-4 py-2 rounded-md w-full outline-none focus:border-gray-400 placeholder:text-gray-400
                text-slate-700"
                  placeholder="photo url"
                  type="text"
                  name="photo"
                />
              </div>
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
                <button className="px-4 py-2 rounded-md w-full outline-none text-white bg-[#aea1ea] active:bg-[#aea1ea] hover:bg-[#9a8ade] transition-all duration-150">
                  Register
                </button>
              </div>
            </form>
            <div className="flex space-x-3 text-sm ">
              <span className="text-gray-400">Already have an account?</span>
              <Link to="/login" className="text-[#8d79e6]">
                Go to login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute">
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
    </>
  );
}

export default Registration;
