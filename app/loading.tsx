function LoadingScreen() {
  return (
    <div className="page-wrap mx-auto mt-6 max-w-xl" style={{ minHeight: "320px" }}>
      <p className="text-center text-sm font-medium text-slate-500">Preparing your workspace...</p>
      <div className="loader-animation"></div>
    </div>
  );
}

export default LoadingScreen;
