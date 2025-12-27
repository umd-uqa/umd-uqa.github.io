window.Home = function Home() {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative bg-gradient-to-b from-[#232742] to-[#1a1c2e] text-white py-32 border-b border-[#3b4166] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1000 500">
            <defs>
              <radialGradient id="nucleusGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#9d9ff5" stopOpacity="1" />
                <stop offset="50%" stopColor="#7c7fc4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#5a5d9e" stopOpacity="0.3" />
              </radialGradient>
              <radialGradient id="electronGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#b8baff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7c7fc4" stopOpacity="0.6" />
              </radialGradient>
            </defs>
            
            {/* Central Nucleus with Gradient */}
            <circle cx="500" cy="250" r="25" fill="url(#nucleusGrad)" />
            <circle cx="500" cy="250" r="30" fill="none" stroke="#9d9ff5" strokeWidth="2" opacity="0.6" />
            
            {/* Electron Orbital Rings */}
            <ellipse cx="500" cy="250" rx="120" ry="60" fill="none" stroke="#7c7fc4" strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="500" cy="250" rx="120" ry="60" fill="none" stroke="#7c7fc4" strokeWidth="1.5" opacity="0.5" transform="rotate(60 500 250)" />
            <ellipse cx="500" cy="250" rx="120" ry="60" fill="none" stroke="#7c7fc4" strokeWidth="1.5" opacity="0.5" transform="rotate(120 500 250)" />
            
            {/* Outer Orbital Ring */}
            <ellipse cx="500" cy="250" rx="180" ry="90" fill="none" stroke="#6a6db0" strokeWidth="1" opacity="0.4" />
            <ellipse cx="500" cy="250" rx="180" ry="90" fill="none" stroke="#6a6db0" strokeWidth="1" opacity="0.4" transform="rotate(45 500 250)" />
            
            {/* Electrons on orbits */}
            <circle cx="620" cy="250" r="8" fill="url(#electronGrad)">
              <animateTransform attributeName="transform" type="rotate" from="0 500 250" to="360 500 250" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="380" cy="250" r="8" fill="url(#electronGrad)">
              <animateTransform attributeName="transform" type="rotate" from="0 500 250" to="360 500 250" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="190" r="7" fill="url(#electronGrad)">
              <animateTransform attributeName="transform" type="rotate" from="60 500 250" to="420 500 250" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="310" r="7" fill="url(#electronGrad)">
              <animateTransform attributeName="transform" type="rotate" from="120 500 250" to="480 500 250" dur="7s" repeatCount="indefinite" />
            </circle>
            
            {/* Quantum Energy Waves */}
            <path d="M 300 250 Q 400 230, 500 250 T 700 250" fill="none" stroke="#7c7fc4" strokeWidth="0.8" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M 300 250 Q 400 270, 500 250 T 700 250" fill="none" stroke="#7c7fc4" strokeWidth="0.8" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" begin="1.5s" repeatCount="indefinite" />
            </path>
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
