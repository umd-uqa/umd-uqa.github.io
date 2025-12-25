window.Contact = function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16 animate-fade-in">
      <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
        <h2 className="text-4xl font-light text-white mb-12 text-center">Get In Touch</h2>

        <div className="grid md:grid-cols-2 gap-12 mb-16">

          {/* LEFT SIDE: STUDENTS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-[#7c7fc4] border-b border-[#3b4166] pb-2">Students</h3>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Looking to get involved or attend a workshop? The best way to find us is in person.
              </p>
              <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166] group hover:border-[#7c7fc4] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {/* Modern Map Pin SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#7c7fc4]">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-white font-medium text-lg">Visit Us</h4>
                </div>
                <p className="text-slate-200 text-xl font-light pl-9">Physics Toll 2124</p>
                <p className="text-sm text-slate-400 mt-4 italic pl-9">
                  Please check the <span className="text-[#7c7fc4] cursor-pointer hover:underline" onClick={() => window.location.hash = 'events'}>Events</span> page for specific meeting dates and times.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTACT US (Professional/General) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-[#7c7fc4] border-b border-[#3b4166] pb-2">Contact Us</h3>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                For research collaborations, industry partnerships, or general administrative inquiries, please reach out to our executive board.
              </p>
              <div className="bg-[#232742] p-6 rounded-lg border border-[#3b4166]">
                <div className="flex items-start gap-3">
                  {/* Info Circle SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#7c7fc4] mt-0.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836c-.149.598.019 1.225.44 1.645a4.5 4.5 0 001.291.939c1.146.573 2.437-.463 2.126-1.706l-.709-2.836c-.149-.598-.019-1.225-.44-1.645a4.5 4.5 0 00-1.291-.939z" clipRule="evenodd" />
                  </svg>
                  <p className="text-slate-300 text-sm italic">
                    All inquiries are monitored by our board, and we will get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CENTER: EMAIL BUTTON */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-[#3b4166]">
          <p className="text-slate-400 text-sm mb-6">Prefer direct messaging? Reach us via email:</p>
          <button
            onClick={() => window.location.href = 'mailto:umd.uqa@gmail.com'}
            className="bg-[#7c7fc4] hover:bg-[#6a6db0] text-white px-12 py-4 rounded-full transition-all duration-300 shadow-lg text-lg font-light tracking-wide flex items-center gap-3 group"
          >
            {/* Mail SVG with group hover effect */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <span>Email Us</span>
          </button>
          <p className="mt-4 text-[#7c7fc4] font-mono text-sm">umd.uqa@gmail.com</p>
        </div>
      </div>
    </div>
  );
};