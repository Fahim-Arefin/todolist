import Button from "./Button";

function Banner() {
  return (
    <div
      data-aos="fade-right"
      className="h-[450px] md:h-[800px] flex justify-center items-center mb-24 bg-[#102542]"
    >
      <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6 lg:space-y-4 z-20">
        <h1
          className="text-2xl md:text-3xl lg:text-5xl font-bold text-center
          bg-gradient-to-r from-[#F87060]  to-[#F87060] text-transparent bg-clip-text"
        >
          ProTasker: Turning Chaos into Checklist.
        </h1>

        <span
          className="text-sm md:text-lg lg:text-xl font-semibold mx-5 text-center
              bg-gradient-to-r from-gray-100 to-blue-200 text-transparent bg-clip-text "
        >
          - Where Tasks Meet Efficiency. Empower Your Day with Seamless Task
          Control.
        </span>
        <Button
          primary
          outline
          className="px-4 py-2 text-[#F87060] hover:text-white"
          to="/dashboard"
        >
          Let’s Explore
        </Button>
      </div>
    </div>
  );
}

export default Banner;
