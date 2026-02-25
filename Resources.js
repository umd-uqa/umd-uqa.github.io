window.Resources = function Resources() {
  // 1. Add state to keep track of the selected video
  const [selectedVideo, setSelectedVideo] = React.useState("");

  // 2. Define the videos you provided
  const videoData = {
    "Neutral Atom Quantum Computing-Quera": "agOdzgWTr-Y",
    "Quera Quantum Challenges Walkthrough": "i_MKOCxInOQ",
    "Intro To Blockade-Quera": "xEa3WIzgxDQ"
  };

  return (
    <div className="min-h-screen bg-[#232742] flex items-center justify-center p-8">
      <div className="text-center w-full max-w-3xl">
        <p className="text-slate-300 text-xl mb-6">Select a Quantum Lecture:</p>

        {/* 3. The Dropdown Menu */}
        <select
          className="bg-[#7c7fc4] text-white p-3 rounded-lg mb-8 outline-none cursor-pointer hover:bg-white hover:text-[#232742] transition-colors"
          onChange={(e) => setSelectedVideo(e.target.value)}
          value={selectedVideo}
        >
          <option value="">-- Choose a Topic --</option>
          {Object.entries(videoData).map(([title, id]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>

        {/* 4. The Video Player Section */}
        {selectedVideo ? (
          <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden shadow-2xl border-2 border-[#7c7fc4]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo}?rel=0`}
              title="UQA Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed border-slate-500 rounded-xl text-slate-500">
            Select a video above to start watching on-site
          </div>
        )}

        {/* Keeping your original link below the player if needed */}
        <div className="mt-12">
           <a
            href="https://quantum-coalition-learning-resource.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#7c7fc4] hover:bg-white hover:text-[#232742] text-white px-6 py-2 rounded transition-colors"
          >
            Access More Learning Resources
          </a>
        </div>
      </div>
    </div>
  );
};