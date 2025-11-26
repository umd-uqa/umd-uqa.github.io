import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AboutUs from './AboutUs';
import Events from './Events';

function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'aboutus', label: 'About Us' },
    { id: 'events', label: 'Events' }
  ];

  // Default calendar URL (the one provided)
  const defaultCalendarUrl =
    'https://calendar.google.com/calendar/embed?src=3c2a01314cb17c4b0f1fe29b83c80bf8f1753a4217fa9bab39ed151a019aa919%40group.calendar.google.com&ctz=America%2FNew_York';

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Navigation */}
      <nav className="bg-slate-200 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="35" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <ellipse cx="50" cy="50" rx="45" ry="15" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <ellipse cx="50" cy="50" rx="15" ry="45" stroke="#7c7fc4" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="4" fill="#7c7fc4" />
                <text x="50" y="55" textAnchor="middle" fill="#7c7fc4" fontSize="20" fontWeight="bold">UQA</text>
              </svg>
              <div>
                <div className="text-xl font-light text-slate-700">Undergraduate</div>
                <div className="text-xl font-light text-slate-700">Quantum</div>
                <div className="text-xl font-light text-slate-700">Association</div>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              {navigation.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className="text-slate-600 hover:text-indigo-400 transition-colors font-light"
                >
                  {item.label}
                </button>
              ))}

              {/* Social Icons */}
              <div className="flex items-center gap-4 ml-4">
                <span className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer">📘</span>
                <span className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer">🐦</span>
                <span className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer">📸</span>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => setCurrentPage('contact')}
                className="bg-indigo-400 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full transition-colors font-light"
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
          {/* Hero Section with Background */}
          <div className="relative bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900 text-white py-32">
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 1000 500">
                {[...Array(100)].map((_, i) => (
                  <line
                    key={i}
                    x1={Math.random() * 1000}
                    y1={Math.random() * 500}
                    x2={Math.random() * 1000}
                    y2={Math.random() * 500}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity={Math.random() * 0.3}
                  />
                ))}
                <circle cx="500" cy="250" r="80" fill="rgba(99,102,241,0.2)" />
                <circle cx="500" cy="250" r="100" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>
            <div className="relative max-w-7xl mx-auto px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide">
                Discover the Future of Engineering and Technology
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-5xl mx-auto px-8 py-16">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <h2 className="text-3xl font-light text-slate-800 mb-8">Who We Are</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
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
                  <h3 className="text-xl font-light text-slate-800 mb-4">What We Do</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li>• Weekly workshops on quantum programming and algorithms</li>
                    <li>• Guest lectures from quantum industry professionals</li>
                    <li>• Collaborative projects and quantum hackathons</li>
                    <li>• Social events and study groups</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-800 mb-4">Get Involved</h3>
                  <ul className="space-y-3 text-slate-600">
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

      {/* About Us page (separate) */}
      {currentPage === 'aboutus' && (
        <AboutUs />
      )}

      {/* Events page (separate) */}
      {currentPage === 'events' && (
        <Events defaultUrl={defaultCalendarUrl} />
      )}

      {/* Contact Page */}
      {currentPage === 'contact' && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <h2 className="text-4xl font-light text-slate-800 mb-8">Get In Touch</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">Contact Information</h3>
                <div className="space-y-3 text-slate-600">
                  <p>
                    <span className="font-medium">Email:</span> umd.uqa@gmail.com
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> University of Maryland, College Park
                  </p>
                  <p>
                    <span className="font-medium">Department:</span> Physics Building
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-2xl font-light text-slate-800 mb-4">Join Our Community</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Interested in joining UQA? We welcome students from all backgrounds and experience levels.
                  Send us an email to learn more about membership, upcoming events, and how to get involved!
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="text-xl font-light text-slate-800 mb-3">Meeting Times</h4>
                  <p className="text-slate-600">
                    General meetings are held every other Wednesday at 6:00 PM in the Physics Building.
                    Check our events page for specific dates and locations.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-2xl font-light text-slate-800 mb-4">Collaboration Opportunities</h3>
                <p className="text-slate-600 leading-relaxed">
                  Are you a researcher, company, or organization interested in collaborating with UQA?
                  We're always open to partnerships, sponsorships, and speaking opportunities.
                  Reach out to discuss how we can work together to advance quantum education!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center text-slate-500 text-sm">
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