import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import Pannel from "../components/Pannel";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Spinner from "../components/Spinner";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { formatRemainingTime } from "../utils/util";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function Dashboard() {
  const { baseURL, user, successToast, errorToast } = useAuth();
  const [editId, setEditId] = useState("");
  const [editCollection, setEditCollection] = useState("");
  const [modalRef, setModalRef] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selected, setSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [newData, setNewData] = useState(null);

  const handleCreate = () => {
    setSelected(!selected);
  };

  const handleDelete = async (id, collection) => {
    console.log(id, collection);
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
          .delete(`${baseURL}/${collection}/${id}`)
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
      reset();
      const res = await axios.post(`${baseURL}/tasks`, {
        ...data,
        userId: user.uid,
        createdAt: Date.now(),
      });
      setNewData(res.data);
      setSelected(!selected);
      successToast("Task Created Successful !!", 2000);
    } catch (error) {
      console.log(error);
      errorToast("Task Could Not Created !!", 2000);
    }
  };

  const handleEditSubmit = async (e) => {
    try {
      e.preventDefault();
      document.getElementById(modalRef).close();
      const data = {
        title: e.target.title.value,
        description: e.target.description.value,
        deadline: e.target.deadline.value,
        priority: e.target.priority.value,
        userId: user.uid,
        createdAt: Date.now(),
      };
      console.log(editId, editCollection, data);
      const res = await axios.patch(
        `${baseURL}/${editCollection}/${editId}`,
        data
      );
      setNewData({ ...res.data });
      successToast("Task Updated Successful !!", 2000);
    } catch (error) {
      console.log(error);
      errorToast("Task Could Not Updated !!", 2000);
    }
  };

  const handleDragDrop = async (results) => {
    console.log(results);
    const { source, destination } = results;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // drag and drop to the same pannel
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "tasks") {
        const reOrderedStore = [...data];
        const [removedArr] = reOrderedStore.splice(source.index, 1);
        reOrderedStore.splice(destination.index, 0, removedArr);
        setData(reOrderedStore);
        // after drag when data changed then we need to update database
        await axios.put(`${baseURL}/${source.droppableId}`, {
          reOrderedStore,
        });
      } else if (source.droppableId === "ongoing") {
        const reOrderedStore = [...ongoing];
        const [removedArr] = reOrderedStore.splice(source.index, 1);
        reOrderedStore.splice(destination.index, 0, removedArr);
        setOngoing(reOrderedStore);
        // after drag when data changed then we need to update database
        await axios.put(`${baseURL}/${source.droppableId}`, {
          reOrderedStore,
        });
      } else {
        const reOrderedStore = [...completed];
        const [removedArr] = reOrderedStore.splice(source.index, 1);
        reOrderedStore.splice(destination.index, 0, removedArr);
        setCompleted(reOrderedStore);
        // after drag when data changed then we need to update database
        await axios.put(`${baseURL}/${source.droppableId}`, {
          reOrderedStore,
        });
      }
    } else {
      // step 01: Delete source item from database
      let deletedItem;
      if (source.droppableId === "tasks") {
        deletedItem = data[source.index];
        const updatedData = data.filter((item) => item._id !== deletedItem._id);
        setData(updatedData);
        await axios.delete(`${baseURL}/tasks/${deletedItem._id}`);
      } else if (source.droppableId === "ongoing") {
        deletedItem = ongoing[source.index];
        const updatedData = ongoing.filter(
          (item) => item._id !== deletedItem._id
        );
        setOngoing(updatedData);
        await axios.delete(`${baseURL}/ongoing/${deletedItem._id}`);
      } else {
        deletedItem = completed[source.index];
        const updatedData = completed.filter(
          (item) => item._id !== deletedItem._id
        );
        setCompleted(updatedData);
        await axios.delete(`${baseURL}/completed/${deletedItem._id}`);
      }

      // Step 02: Add the item at a perticular place of a perticular droppable
      if (destination.droppableId === "tasks") {
        const reOrderedStore = [...data];
        reOrderedStore.splice(destination.index, 0, deletedItem);
        setData(reOrderedStore);
        await axios.put(`${baseURL}/${destination.droppableId}`, {
          reOrderedStore,
        });
      } else if (destination.droppableId === "ongoing") {
        const reOrderedStore = [...ongoing];
        reOrderedStore.splice(destination.index, 0, deletedItem);
        setOngoing(reOrderedStore);
        await axios.put(`${baseURL}/${destination.droppableId}`, {
          reOrderedStore,
        });
      } else {
        const reOrderedStore = [...completed];
        reOrderedStore.splice(destination.index, 0, deletedItem);
        setCompleted(reOrderedStore);
        await axios.put(`${baseURL}/${destination.droppableId}`, {
          reOrderedStore,
        });
      }
    }
  };

  // fetch for the first time
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res1 = await axios.get(`${baseURL}/tasks/${user.uid}`);
        const res2 = await axios.get(`${baseURL}/ongoing/${user.uid}`);
        const res3 = await axios.get(`${baseURL}/completed/${user.uid}`);
        setData(res1.data);
        setOngoing(res2.data);
        setCompleted(res3.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [baseURL, user.uid]);

  // after edit,delete,create we again fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res1 = await axios.get(`${baseURL}/tasks/${user.uid}`);
        const res2 = await axios.get(`${baseURL}/ongoing/${user.uid}`);
        const res3 = await axios.get(`${baseURL}/completed/${user.uid}`);
        setData(res1.data);
        setOngoing(res2.data);
        setCompleted(res3.data);
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
        <DragDropContext onDragEnd={handleDragDrop}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
       md:gap-x-8 lg:gap-x-12 xl:gap-x-20 mt-16 xl:px-16 "
          >
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Pannel title={"ToDo List"} className="col-span-1">
                    {data.length === 0 && (
                      <div className="text-center mt-24">⛔ Data not found</div>
                    )}
                    {data &&
                      data.map((task, index) => (
                        <>
                          <Draggable
                            draggableId={task._id}
                            key={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className="p-4 rounded-md bg-[#F87060] text-black"
                              >
                                <div className="flex justify-between">
                                  <div className="font-bold text-xl">
                                    {task.title}
                                  </div>
                                  <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                                    {task.priority}
                                  </div>
                                </div>
                                <div>{formatRemainingTime(task.deadline)}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div
                                    onClick={() =>
                                      document
                                        .getElementById(`${task._id}`)
                                        .showModal()
                                    }
                                    className="text-sm bg-[#173257] rounded-sm px-2 py-1 text-white cursor-pointer"
                                  >
                                    Description
                                  </div>
                                  <div className="flex space-x-1 items-center">
                                    <div
                                      onClick={() => {
                                        document
                                          .getElementById(task.createdAt)
                                          .showModal();
                                        setModalRef(task.createdAt);
                                        setEditId(task._id);
                                        setEditCollection("tasks");
                                      }}
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-5 h-5"
                                        src="/edit.png"
                                        alt=""
                                      />
                                    </div>
                                    <div
                                      onClick={() =>
                                        handleDelete(task._id, "tasks")
                                      }
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-6 h-6"
                                        src="/delete.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                          {/* Modals */}
                          {/* details */}
                          <dialog id={task._id} className="modal text-zinc-950">
                            <div className="modal-box bg-[#F87060]">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-xl">
                                {task.title}
                              </h3>
                              <p className="py-4">{task.description}</p>
                            </div>
                          </dialog>

                          <dialog
                            id={task.createdAt}
                            className="modal text-zinc-950"
                          >
                            <div className="modal-box">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <form
                                onSubmit={handleEditSubmit}
                                key={task._id}
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
                                    defaultValue={task.title}
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="description"
                                  >
                                    Description:
                                  </label>
                                  <textarea
                                    defaultValue={task.description}
                                    id="description"
                                    name="description"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="deadline"
                                  >
                                    Deadline:
                                  </label>
                                  <input
                                    defaultValue={task.deadline}
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
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
                                  >
                                    <option
                                      selected={task.priority === "low"}
                                      value="low"
                                    >
                                      Low
                                    </option>
                                    <option
                                      selected={task.priority === "moderate"}
                                      value="moderate"
                                    >
                                      Moderate
                                    </option>
                                    <option
                                      selected={task.priority === "high"}
                                      value="high"
                                    >
                                      High
                                    </option>
                                  </select>
                                </div>
                                <div className="text-center">
                                  <Button
                                    secondary
                                    className="px-4 py-2 text-white"
                                  >
                                    Update Task
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </dialog>
                          {/* edit form modal */}
                        </>
                      ))}
                  </Pannel>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="ongoing">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Pannel title={"Ongoing List"} className="col-span-1">
                    {ongoing.length === 0 && (
                      <div className="text-center mt-24">⛔ Data not found</div>
                    )}
                    {ongoing &&
                      ongoing.map((task, index) => (
                        <>
                          <Draggable
                            draggableId={task._id}
                            key={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className="p-4 rounded-md bg-[#F87060] text-black"
                              >
                                <div className="flex justify-between">
                                  <div className="font-bold text-xl">
                                    {task.title}
                                  </div>
                                  <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                                    {task.priority}
                                  </div>
                                </div>
                                <div>{formatRemainingTime(task.deadline)}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div
                                    onClick={() =>
                                      document
                                        .getElementById(`${task._id}`)
                                        .showModal()
                                    }
                                    className="text-sm bg-[#173257] rounded-sm px-2 py-1 text-white cursor-pointer"
                                  >
                                    Description
                                  </div>
                                  <div className="flex space-x-1 items-center">
                                    <div
                                      onClick={() => {
                                        document
                                          .getElementById(task.createdAt)
                                          .showModal();
                                        setModalRef(task.createdAt);
                                        setEditId(task._id);
                                        setEditCollection("ongoing");
                                      }}
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-5 h-5"
                                        src="/edit.png"
                                        alt=""
                                      />
                                    </div>
                                    <div
                                      onClick={() =>
                                        handleDelete(task._id, "ongoing")
                                      }
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-6 h-6"
                                        src="/delete.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                          {/* Modal */}
                          <dialog id={task._id} className="modal text-zinc-950">
                            <div className="modal-box bg-[#F87060]">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-xl">
                                {task.title}
                              </h3>
                              <p className="py-4">{task.description}</p>
                            </div>
                          </dialog>

                          <dialog
                            id={task.createdAt}
                            className="modal text-zinc-950"
                          >
                            <div className="modal-box">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <form
                                onSubmit={handleEditSubmit}
                                key={task._id}
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
                                    defaultValue={task.title}
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="description"
                                  >
                                    Description:
                                  </label>
                                  <textarea
                                    defaultValue={task.description}
                                    id="description"
                                    name="description"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="deadline"
                                  >
                                    Deadline:
                                  </label>
                                  <input
                                    defaultValue={task.deadline}
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
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
                                  >
                                    <option
                                      selected={task.priority === "low"}
                                      value="low"
                                    >
                                      Low
                                    </option>
                                    <option
                                      selected={task.priority === "moderate"}
                                      value="moderate"
                                    >
                                      Moderate
                                    </option>
                                    <option
                                      selected={task.priority === "high"}
                                      value="high"
                                    >
                                      High
                                    </option>
                                  </select>
                                </div>
                                <div className="text-center">
                                  <Button
                                    secondary
                                    className="px-4 py-2 text-white"
                                  >
                                    Update Task
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </dialog>
                        </>
                      ))}
                  </Pannel>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="completed">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Pannel title={"Completed List"} className="col-span-1">
                    {completed.length === 0 && (
                      <div className="text-center mt-24">⛔ Data not found</div>
                    )}
                    {completed &&
                      completed.map((task, index) => (
                        <>
                          <Draggable
                            draggableId={task._id}
                            key={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className="p-4 rounded-md bg-[#F87060] text-black"
                              >
                                <div className="flex justify-between">
                                  <div className="font-bold text-xl">
                                    {task.title}
                                  </div>
                                  <div className="bg-[#173257] w-fit px-2 py-1 rounded-md text-white">
                                    {task.priority}
                                  </div>
                                </div>
                                <div>{formatRemainingTime(task.deadline)}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div
                                    onClick={() =>
                                      document
                                        .getElementById(`${task._id}`)
                                        .showModal()
                                    }
                                    className="text-sm bg-[#173257] rounded-sm px-2 py-1 text-white cursor-pointer"
                                  >
                                    Description
                                  </div>
                                  <div className="flex space-x-1 items-center">
                                    <div
                                      onClick={() => {
                                        document
                                          .getElementById(task.createdAt)
                                          .showModal();
                                        setModalRef(task.createdAt);
                                        setEditId(task._id);
                                        setEditCollection("completed");
                                      }}
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-5 h-5"
                                        src="/edit.png"
                                        alt=""
                                      />
                                    </div>
                                    <div
                                      onClick={() =>
                                        handleDelete(task._id, "completed")
                                      }
                                      className="hover:cursor-pointer hover:scale-125 active:scale-110 transition-all duration-150"
                                    >
                                      <img
                                        className="w-6 h-6"
                                        src="/delete.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                          {/* Modal */}
                          <dialog id={task._id} className="modal text-zinc-950">
                            <div className="modal-box bg-[#F87060]">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-xl">
                                {task.title}
                              </h3>
                              <p className="py-4">{task.description}</p>
                            </div>
                          </dialog>

                          <dialog
                            id={task.createdAt}
                            className="modal text-zinc-950"
                          >
                            <div className="modal-box">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <form
                                onSubmit={handleEditSubmit}
                                key={task._id}
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
                                    defaultValue={task.title}
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="description"
                                  >
                                    Description:
                                  </label>
                                  <textarea
                                    defaultValue={task.description}
                                    id="description"
                                    name="description"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-600 font-bold mb-2"
                                    htmlFor="deadline"
                                  >
                                    Deadline:
                                  </label>
                                  <input
                                    defaultValue={task.deadline}
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                  />
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
                                  >
                                    <option
                                      selected={task.priority === "low"}
                                      value="low"
                                    >
                                      Low
                                    </option>
                                    <option
                                      selected={task.priority === "moderate"}
                                      value="moderate"
                                    >
                                      Moderate
                                    </option>
                                    <option
                                      selected={task.priority === "high"}
                                      value="high"
                                    >
                                      High
                                    </option>
                                  </select>
                                </div>
                                <div className="text-center">
                                  <Button
                                    secondary
                                    className="px-4 py-2 text-white"
                                  >
                                    Update Task
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </dialog>
                        </>
                      ))}
                  </Pannel>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
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
