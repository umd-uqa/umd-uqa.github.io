// Define the component globally for the CDN setup
window.About = function About() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
        <h2 className="text-4xl font-light text-white mb-8">About UMD UQA</h2>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          {/* Mission Section */}
          <div>
            <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Our Mission</h3>
            <p>
              The Undergraduate Quantum Association is committed to making quantum technologies
              accessible and understandable to undergraduate students of all majors and backgrounds.
            </p>
          </div>

          {/* Vision Section */}
          <div>
            <h3 className="text-2xl font-light text-[#7c7fc4] mb-4">Our Vision</h3>
            <p>
              We envision a community where students can freely explore quantum concepts and build
              connections with peers who share their passion for quantum science.
            </p>
          </div>

          {/* Why Join UQA Section (Your Code) */}
          <div>
            <h3 className="text-2xl font-light text-white mb-4">Why Join UQA?</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
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
  );
};