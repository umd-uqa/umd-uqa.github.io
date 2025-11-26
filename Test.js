import React, { useState } from 'react'; // Ensure React and useState are imported
import { FaFacebook, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import UQALogo from './UQA_white.jpg'; // Assuming the logo path is correct

function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigation = [
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' }
  ];

  const upcomingEvents = [
    {
      title: 'Quantum Computing Workshop',
      date: 'November 15, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Physics Building, Room 1410',
      description: 'Hands-on introduction to quantum algorithms using Qiskit'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation - Dark background */}
      <nav className="bg-slate-800 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Replaced SVG with image */}
            <div className="flex items-center gap-4">
              <img 
                src={UQALogo} 
                alt="UMD UQA Logo" 
                className="h-16 w-auto" 
              />
              <div>
                <div className="text-xl font-light text-white">Undergraduate</div>
                <div className="text-xl font-medium text-white">Quantum</div>
                <div className="text-xl font-light text-white">Association</div>
              </div>
            </div>
            
            {/* Nav Links - White hover */}
            <div className="flex items-center gap-8">
              {navigation.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className="text-slate-300 hover:text-slate-50 transition-colors font-light"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Social Icons - White hover */}
              <div className="flex items-center gap-4 ml-4">
                  <span className="text-slate-300 hover:text-slate-50 transition-colors cursor-pointer text-xl">
                      <FaFacebook />
                  </span>
                  <span className="text-slate-300 hover:text-slate-50 transition-colors cursor-pointer text-xl">
                      <FaXTwitter />
                  </span>
                  <span className="text-slate-300 hover:text-slate-50 transition-colors cursor-pointer text-xl">
                      <FaInstagram />
                  </span>
              </div>
              
              {/* Contact Button - Deep Indigo color */}
              <button
                onClick={() => setCurrentPage('contact')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-colors font-medium"
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
          <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-32">
            <div className="absolute inset-0 opacity-30">
              {/* Removed detailed SVG pattern for brevity, simple glow remains */}
              <svg className="w-full h-full" viewBox="0 0 1000 500" fill="white" stroke="white">
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
            <div className="bg-white rounded-lg shadow-xl p-12">
              <h2 className="text-3xl font-light text-slate-800 mb-8">Who We Are</h2>
              <div className="space-y-6 text-slate-700 leading-relaxed">
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
                  {/* Changed bullet color to Indigo/Blue accent */}
                  <ul className="space-y-3 text-slate-700">
                    <li><span className="text-indigo-600">•</span> Weekly workshops on quantum programming and algorithms</li>
                    <li><span className="text-indigo-600">•</span> Guest lectures from quantum industry professionals</li>
                    <li><span className="text-indigo-600">•</span> Collaborative projects and quantum hackathons</li>
                    <li><span className="text-indigo-600">•</span> Social events and study groups</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-800 mb-4">Get Involved</h3>
                  {/* Changed bullet color to Indigo/Blue accent */}
                  <ul className="space-y-3 text-slate-700">
                    <li><span className="text-indigo-600">•</span> Join our weekly meetings every Wednesday at 6:00 PM</li>
                    <li><span className="text-indigo-600">•</span> Connect with students from all backgrounds</li>
                    <li><span className="text-indigo-600">•</span> Access quantum computing resources and tools</li>
                    <li><span className="text-indigo-600">•</span> Network with researchers and industry professionals</li>
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
          <div className="bg-white rounded-lg shadow-xl p-12">
            <h2 className="text-4xl font-light text-slate-800 mb-8">About UMD UQA</h2>
            
            <div className="space-y-8 text-slate-700 leading-relaxed">
              <div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">Our Mission</h3>
                <p>
                  The Undergraduate Quantum Association is committed to making quantum technologies 
                  accessible and understandable to undergraduate students of all majors and backgrounds. 
                  We believe that quantum computing represents the future of technology, and our goal 
                  is to prepare the next generation of quantum scientists and engineers.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">Our Vision</h3>
                <p>
                  We envision a community where students can freely explore quantum concepts, collaborate 
                  on cutting-edge projects, and build connections with peers who share their passion for 
                  quantum science. Through education, hands-on experience, and networking, we aim to 
                  empower students to become leaders in the quantum revolution.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">Why Join UQA?</h3>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-indigo-600 mb-2">Learn & Grow</h4>
                    <p className="text-sm">
                      Access workshops, tutorials, and resources to build your quantum computing skills 
                      from beginner to advanced levels.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-indigo-600 mb-2">Network</h4>
                    <p className="text-sm">
                      Connect with like-minded students, researchers, and industry professionals in 
                      the quantum computing field.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-indigo-600 mb-2">Hands-On Experience</h4>
                    <p className="text-sm">
                      Work on real quantum computing projects using platforms like IBM Qiskit and 
                      participate in hackathons.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-indigo-600 mb-2">Community</h4>
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
          <div className="bg-white rounded-lg shadow-xl p-12">
            <h2 className="text-4xl font-light text-slate-800 mb-8">Upcoming Events</h2>
            
            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-indigo-600 pl-6 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-light text-slate-800">{event.title}</h3>
                    <span className="text-indigo-600 font-light whitespace-nowrap ml-4">
                      {event.date}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-700 mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {event.time}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {event.location}
                    </p>
                  </div>
                  <p className="text-slate-700">{event.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-light text-slate-800 mb-3">Stay Updated</h3>
              <p className="text-slate-700">
                Follow us on social media and join our mailing list to never miss an event!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Page */}
      {currentPage === 'contact' && (
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="bg-white rounded-lg shadow-xl p-12">
            <h2 className="text-4xl font-light text-slate-800 mb-8">Get In Touch</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">Contact Information</h3>
                <div className="space-y-3 text-slate-700">
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
                <p className="text-slate-700 mb-6 leading-relaxed">
                  Interested in joining UQA? We welcome students from all backgrounds and experience levels. 
                  Send us an email to learn more about membership, upcoming events, and how to get involved!
                </p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="text-xl font-light text-slate-800 mb-3">Meeting Times</h4>
                  <p className="text-slate-700">
                    General meetings are held every other Wednesday at 6:00 PM in the Physics Building. 
                    Check our events page for specific dates and locations.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-2xl font-light text-slate-800 mb-4">Collaboration Opportunities</h3>
                <p className="text-slate-700 leading-relaxed">
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
