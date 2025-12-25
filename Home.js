window.Home = function Home() {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative bg-gradient-to-b from-[#232742] to-[#1a1c2e] text-white py-32 border-b border-[#3b4166]">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1000 500">
            {[...Array(100)].map((_, i) => (
              <line key={i} x1={Math.random() * 1000} y1={Math.random() * 500} x2={Math.random() * 1000} y2={Math.random() * 500} stroke="#7c7fc4" strokeWidth="0.5" opacity={Math.random() * 0.4} />
            ))}
            <circle cx="500" cy="250" r="80" fill="rgba(124, 127, 196, 0.1)" />
            <circle cx="500" cy="250" r="100" stroke="#7c7fc4" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide leading-tight text-white">
            Discover the Future of <span className="text-[#7c7fc4]">Engineering</span> and <span className="text-[#7c7fc4]">Technology</span>
          </h1>
        </div>
      </div>

      {/* Who We Are Content */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
          <h2 className="text-3xl font-light text-white mb-8">Who We Are</h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>The Undergraduate Quantum Association (UQA) is a student-run organization dedicated to fostering interest and knowledge in quantum technologies...</p>
            <p>Whether you're a physics major, computer science enthusiast, or simply curious about quantum mechanics, UQA provides a welcoming community...</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-medium text-[#7c7fc4] mb-4">What We Do</h3>
              <ul className="space-y-3 text-slate-300">
                <li>• Weekly workshops on quantum programming</li>
                <li>• Guest lectures from industry professionals</li>
                <li>• Collaborative projects and hackathons</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#7c7fc4] mb-4">Get Involved</h3>
              <ul className="space-y-3 text-slate-300">
                <li>• Join our meetings every Wednesday at 6:00 PM</li>
                <li>• Access quantum computing resources and tools</li>
                <li>• Network with researchers and professionals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};