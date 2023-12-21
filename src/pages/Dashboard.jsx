import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import Pannel from "../components/Pannel";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Spinner from "../components/Spinner";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const { baseURL, user, successToast, errorToast } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selected, setSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState(null);

  const handleCreate = () => {
    setSelected(!selected);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseURL}/tasks/${id}`)
          .then((res) => {
            setNewData(res.data);
            successToast("Task delete successful !!", 2000);
          })
          .catch((e) => {
            console.log(e);
            errorToast("Task Could not delete !!", 2000);
          });
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/tasks`, {
        ...data,
        userId: user.uid,
      });
      setNewData(res.data);
      setSelected(!selected);
      successToast("Task Created Successful !!", 2000);
    } catch (error) {
      console.log(error);
      errorToast("Task Could Not Created !!", 2000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/tasks/${user.uid}`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [baseURL, user.uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/tasks/${user.uid}`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [newData, baseURL, user.uid]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="grow bg-[#102542] px-4 md:px-10 lg:px-4 xl:px-16 2xl:px-20">
        <div className="flex space-x-2 items-center mt-12 justify-center">
          <h1 className="text-2xl text-[#c63525] font-bold">Add A Task</h1>
          <div onClick={handleCreate} className="text-[#F87060] cursor-pointer">
            <img
              className="w-6 h-6 hover:scale-125 transition-all duration-150"
              src={selected ? "/add.png" : "/hide.png"}
              alt="add"
            />
          </div>
        </div>
        <div>
          {!selected && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-md mx-auto text-zinc-700"
            >
              <div className="mb-4">
                <label
                  className="block text-gray-600 font-bold mb-2"
                  htmlFor="title"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors?.title?.type === "required" && (
                  <div className="flex space-x-2 items-center mt-2">
                    <div className="w-5 h-5">
                      <img
                        className="h-full w-full"
                        src="https://img.icons8.com/pastel-glyph/64/FA5252/error--v2.png"
                        alt="error--v2"
                      />
                    </div>
                    <p className="text-[#FA5252] mt-1 text-sm ">
                      Title is required
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-600 font-bold mb-2"
                  htmlFor="description"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  {...register("description", {
                    required: true,
                  })}
                />
                {errors?.description?.type === "required" && (
                  <div className="flex space-x-2 items-center mt-2">
                    <div className="w-5 h-5">
                      <img
                        className="h-full w-full"
                        src="https://img.icons8.com/pastel-glyph/64/FA5252/error--v2.png"
                        alt="error--v2"
                      />
                    </div>
                    <p className="text-[#FA5252] mt-1 text-sm ">
                      description is required
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-600 font-bold mb-2"
                  htmlFor="deadline"
                >
                  Deadline:
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  {...register("deadline", {
                    required: true,
                  })}
                />
                {errors?.deadline?.type === "required" && (
                  <div className="flex space-x-2 items-center mt-2">
                    <div className="w-5 h-5">
                      <img
                        className="h-full w-full"
                        src="https://img.icons8.com/pastel-glyph/64/FA5252/error--v2.png"
                        alt="error--v2"
                      />
                    </div>
                    <p className="text-[#FA5252] mt-1 text-sm ">
                      deadline is required
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-600 font-bold mb-2"
                  htmlFor="priority"
                >
                  Priority:
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  {...register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="text-center">
                <Button secondary outline className="px-4 py-2 text-white">
                  Create Task
                </Button>
              </div>
            </form>
          )}
        </div>
        {/* pannel */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
       md:gap-x-8 lg:gap-x-12 xl:gap-x-20 mt-16 xl:px-16 "
        >
          <Pannel title={"ToDo List"} className="col-span-1">
            {data &&
              data.map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-md bg-[#F87060] text-black"
                >
                  <div className="flex justify-between">
                    <div className="font-bold text-xl">{task.title}</div>
                    <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                      {task.priority}
                    </div>
                  </div>
                  <div>{task.deadline}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div>details</div>
                    <div className="flex space-x-1 items-center">
                      <div>
                        <img className="w-5 h-5" src="/edit.png" alt="" />
                      </div>
                      <div
                        onClick={() => handleDelete(task._id)}
                        className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                      >
                        <img className="w-6 h-6" src="/delete.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Pannel>
          <Pannel title={"Ongoing List"} className="col-span-1">
            {/* <div className="p-4 rounded-md bg-[#F87060] text-black">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Assignment 8</div>
              <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                Low
              </div>
            </div>
            <div>23 December</div>
          </div>
          <div className="p-4 rounded-md bg-[#F87060] text-black">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Assignment 8</div>
              <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                Low
              </div>
            </div>
            <div>23 December</div>
          </div> */}
          </Pannel>
          <Pannel title={"Complited List"} className="col-span-1">
            {/* <div className="p-4 rounded-md bg-[#F87060] text-black">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Assignment 8</div>
              <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                Low
              </div>
            </div>
            <div>23 December</div>
          </div>
          <div className="p-4 rounded-md bg-[#F87060] text-black">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Assignment 8</div>
              <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                Low
              </div>
            </div>
            <div>23 December</div>
          </div> */}
          </Pannel>
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
    </>
  );
}

export default Dashboard;
