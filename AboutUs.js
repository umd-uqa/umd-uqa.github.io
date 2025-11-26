import React from 'react';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="bg-white rounded-lg shadow-sm p-12">
        <h2 className="text-4xl font-light text-slate-800 mb-8">About UMD UQA</h2>

        <div className="space-y-8 text-slate-600 leading-relaxed">
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
                <h4 className="font-medium text-slate-800 mb-2">Learn & Grow</h4>
                <p className="text-sm">
                  Access workshops, tutorials, and resources to build your quantum computing skills
                  from beginner to advanced levels.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Network</h4>
                <p className="text-sm">
                  Connect with like-minded students, researchers, and industry professionals in
                  the quantum computing field.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Hands-On Experience</h4>
                <p className="text-sm">
                  Work on real quantum computing projects using platforms like IBM Qiskit and
                  participate in hackathons.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-2">Community</h4>
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
}