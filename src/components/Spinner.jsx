function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-300/30 backdrop-blur-sm z-50">
      <span className="loading loading-ring loading-lg"></span>;
    </div>
  );
}

export default Spinner;
