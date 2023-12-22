function Pannel({ children, className, title, ...rest }) {
  return (
    <div
      {...rest}
      className={`relative h-[800px] bg-[#173257] rounded-md p-2 ${className} mb-24 overflow-scroll`}
    >
      <h1 className="sticky top-0 text-center text-xl text-[#F87060] font-bold bg-[#102542] p-4 rounded-md">
        {title}
      </h1>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

export default Pannel;
