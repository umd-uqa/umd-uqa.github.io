const { useState } = React;

function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigation = [
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' }
  ];

  // BRAND COLORS:
  // Background: #232742 (Deep Navy)
  // Card Background: #2d3255 (Lighter Navy)
  // Accent: #7c7fc4 (Periwinkle from Logo)

  const upcomingEvents = [
    {
      title: 'Quantum Computing Workshop',
      date: 'November 15, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Physics Building, Room 1410',
      description: 'Hands-on introduction to quantum algorithms using Qiskit'
    },
    {
      title: 'Guest Lecture: Quantum Cryptography',
      date: 'November 22, 2025',
      time: '5:30 PM - 7:00 PM',
      location: 'Edward St. John Learning & Teaching Center',
      description: 'Dr. Sarah Chen from IBM Quantum discusses post-quantum cryptography'
    },
    {
      title: 'Social Meetup & Study Session',
      date: 'December 1, 2025',
      time: '4:00 PM - 6:00 PM',
      location: 'Stamp Student Union',
      description: 'Casual gathering to discuss quantum topics and work on projects together'
    }
  ];

  return (
    // CHANGED: Main background to Deep Navy
    <div className="min-h-screen bg-[#232742] text-slate-200 font-sans">
      {/* Navigation */}
      {/* CHANGED: Nav background to match body, border to lighter navy */}
      <nav className="bg-[#232742] border-b border-[#3b4166]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
                {/* Logo colors were already perfect (#7c7fc4), kept as is */}
                <circle cx="50" cy="50" r="35" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <ellipse cx="50" cy="50" rx="45" ry="15" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <ellipse cx="50" cy="50" rx="15" ry="45" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="4" fill="#7c7fc4" />
                <text x="50" y="55" textAnchor="middle" fill="#7c7fc4" fontSize="20" fontWeight="bold">UQA</text>
              </svg>
              <div>
                {/* CHANGED: Text color to White/Gray */}
                <div className="text-xl font-light text-white leading-tight">Undergraduate</div>
                <div className="text-xl font-light text-white leading-tight">Quantum</div>
                <div className="text-xl font-light text-white leading-tight">Association</div>
              </div>
            </div>
            
            {/* Nav Links */}
            <div className="flex items-center gap-8">
              {navigation.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  // CHANGED: Hover color to the logo accent
                  className="text-slate-300 hover:text-[#7c7fc4] transition-colors font-light"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Social Icons */}
              <div className="flex items-center gap-4 ml-4">
                <span className="text-slate-400 hover:text-[#7c7fc4] transition-colors cursor-pointer">📘</span>
                <span className="text-slate-400 hover:text-[#7c7fc4] transition-colors cursor-pointer">🐦</span>
                <span className="text-slate-400 hover:text-[#7c7fc4] transition-colors cursor-pointer">📸</span>
              </div>
              
              {/* Contact Button */}
              <button
                onClick={() => setCurrentPage('contact')}
                // CHANGED: Button background to #7c7fc4 (Logo Accent)
                className="bg-[#7c7fc4] hover:bg-[#6a6db0] text-white px-6 py-2.5 rounded-full transition-colors font-light"
              >
                Contact UMD UQA
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Home/Hero Page */}
      {currentPage === 'home' && (
        <div>
          {/* Hero Section */}
          {/* CHANGED: Gradient to start from Nav color into a slightly lighter/purpler hue */}
          <div className="relative bg-gradient-to-b from-[#232742] to-[#1a1c2e] text-white py-32 border-b border-[#3b4166]">
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 1000 500">
                {[...Array(100)].map((_, i) => (
                  <line
                    key={i}
                    x1={Math.random() * 1000}
                    y1={Math.random() * 500}
                    x2={Math.random() * 1000}
                    y2={Math.random() * 500}
                    stroke="#7c7fc4" 
                    strokeWidth="0.5"
                    opacity={Math.random() * 0.4}
                  />
                ))}
                <circle cx="500" cy="250" r="80" fill="rgba(124, 127, 196, 0.1)" />
                <circle cx="500" cy="250" r="100" stroke="#7c7fc4" strokeWidth="1" fill="none" opacity="0.3" />
              </svg>
            </div>
            <div className="relative max-w-7xl mx-auto px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide text-white">
                Discover the Future of <span className="text-[#7c7fc4]">Engineering</span> and Technology
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-5xl mx-auto px-8 py-16">
            {/* CHANGED: Card background to Lighter Navy (#2d3255) */}
            <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
              <h2 className="text-3xl font-light text-white mb-8">Who We Are</h2>
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p>
                  The Undergraduate Quantum Association (UQA) is a student-run organization 
                  dedicated to fostering interest and knowledge in quantum technologies among 
                  undergraduate students at the University of Maryland.
                </p>
                <p>
                  Whether you're a physics major, computer science enthusiast, mathematics student, 
                  or simply curious about quantum mechanics, UQA provides a welcoming community 
                  to learn, explore, and collaborate on quantum-related topics.
                </p>
                <p>
                  Our mission is to make quantum computing accessible to all undergraduates through 
                  hands-on learning experiences, research opportunities, and a supportive community 
                  of quantum enthusiasts.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div>
                  <h3 className="text-xl font-medium text-[#7c7fc4] mb-4">What We Do</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Weekly workshops on quantum programming and algorithms</li>
                    <li>• Guest lectures from quantum industry professionals</li>
                    <li>• Collaborative projects and quantum hackathons</li>
                    <li>• Social events and study groups</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#7c7fc4] mb-4">Get Involved</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Join our weekly meetings every Wednesday at 6:00 PM</li>
                    <li>• Connect with students from all backgrounds</li>
                    <li>• Access quantum computing resources and tools</li>
                    <li>• Network with researchers and industry professionals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Page */}
      {currentPage === 'about' && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
            <h2 className="text-4xl font-light text-white mb-8">About UMD UQA</h2>
            
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <div>
                <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Our Mission</h3>
                <p>
                  The Undergraduate Quantum Association is committed to making quantum technologies 
                  accessible and understandable to undergraduate students of all majors and backgrounds. 
                  We believe that quantum computing represents the future of technology, and our goal 
                  is to prepare the next generation of quantum scientists and engineers.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Our Vision</h3>
                <p>
                  We envision a community where students can freely explore quantum concepts, collaborate 
                  on cutting-edge projects, and build connections with peers who share their passion for 
                  quantum science.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-light text-white mb-4">Why Join UQA?</h3>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {/* CHANGED: Inner cards to slightly darker navy for contrast */}
                  <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166]">
                    <h4 className="font-medium text-[#7c7fc4] mb-2">Learn & Grow</h4>
                    <p className="text-sm">
                      Access workshops, tutorials, and resources to build your quantum computing skills 
                      from beginner to advanced levels.
                    </p>
                  </div>
                  <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166]">
                    <h4 className="font-medium text-[#7c7fc4] mb-2">Network</h4>
                    <p className="text-sm">
                      Connect with like-minded students, researchers, and industry professionals in 
                      the quantum computing field.
                    </p>
                  </div>
                  <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166]">
                    <h4 className="font-medium text-[#7c7fc4] mb-2">Hands-On Experience</h4>
                    <p className="text-sm">
                      Work on real quantum computing projects using platforms like IBM Qiskit and 
                      participate in hackathons.
                    </p>
                  </div>
                  <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166]">
                    <h4 className="font-medium text-[#7c7fc4] mb-2">Community</h4>
                    <p className="text-sm">
                      Be part of a welcoming community that supports your academic and professional 
                      growth in quantum technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Page */}
      {currentPage === 'events' && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
            <h2 className="text-4xl font-light text-white mb-8">Upcoming Events</h2>
            
            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                // CHANGED: Border color to Logo Accent
                <div key={index} className="border-l-4 border-[#7c7fc4] pl-6 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-light text-white">{event.title}</h3>
                    <span className="text-[#7c7fc4] font-light whitespace-nowrap ml-4">
                      {event.date}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300 mb-3">
                    <p className="text-sm">
                      <span className="font-medium text-slate-400">Time:</span> {event.time}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-400">Location:</span> {event.location}
                    </p>
                  </div>
                  <p className="text-slate-300">{event.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#232742] rounded-lg p-8 text-center border border-[#3b4166]">
              <h3 className="text-2xl font-light text-white mb-3">Stay Updated</h3>
              <p className="text-slate-300">
                Follow us on social media and join our mailing list to never miss an event!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Page */}
      {currentPage === 'contact' && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
            <h2 className="text-4xl font-light text-white mb-8">Get In Touch</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Contact Information</h3>
                <div className="space-y-3 text-slate-300">
                  <p>
                    <span className="font-medium text-white">Email:</span> umd.uqa@gmail.com
                  </p>
                  <p>
                    <span className="font-medium text-white">Location:</span> University of Maryland, College Park
                  </p>
                  <p>
                    <span className="font-medium text-white">Department:</span> Physics Building
                  </p>
                </div>
              </div>

              <div className="border-t border-[#3b4166] pt-8">
                <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Join Our Community</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Interested in joining UQA? We welcome students from all backgrounds and experience levels. 
                  Send us an email to learn more about membership, upcoming events, and how to get involved!
                </p>
                <div className="bg-[#232742] rounded-lg p-6 border border-[#3b4166]">
                  <h4 className="text-xl font-light text-white mb-3">Meeting Times</h4>
                  <p className="text-slate-300">
                    General meetings are held every other Wednesday at 6:00 PM in the Physics Building. 
                    Check our events page for specific dates and locations.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#3b4166] pt-8">
                <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Collaboration Opportunities</h3>
                <p className="text-slate-300 leading-relaxed">
                  Are you a researcher, company, or organization interested in collaborating with UQA? 
                  We're always open to partnerships, sponsorships, and speaking opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1a1c2e] border-t border-[#3b4166] mt-16">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p className="mb-1">© 2025 UMD Undergraduate Quantum Association</p>
            <p>Empowering the next generation of quantum scientists</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);
