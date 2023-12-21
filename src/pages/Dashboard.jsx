import { useState } from "react";
import Button from "../components/Button";

function Dashboard() {
  const [selected, setSelected] = useState(true);

  const handleCreate = () => {
    setSelected(!selected);
  };

  return (
    <div className="grow bg-[#102542] px-20">
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
          <form className="max-w-md mx-auto text-zinc-700">
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
                required
              >
                <option value="">Select Priority</option>
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
    </div>
  );
}

export default Dashboard;
