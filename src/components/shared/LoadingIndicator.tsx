const LoadingIndicator = () => (
  <div className="loading-container">
    <div className="card rounded-lg p-4">
      <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
      <p className="text-white text-center">Loading...</p>
    </div>
  </div>
);

export default LoadingIndicator;
