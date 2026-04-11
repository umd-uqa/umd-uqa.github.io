const React = window.React || require('react');

window.Events = function Events() {
    const [openEvent, setOpenEvent] = React.useState(null);

    // Restoring your specific event data
    const eventList = [
        {
            id: 'qlcn',
            title: 'QLCN',
            subtitle: 'Quantum Leap Career Nexus',
            date: { month: 'SEPT', day: '15' },
            description: 'Join us for our annual keystone event, where we host a career fair, workshops, industry panels, networking sessions, and research presentations designed to bridge the gap between academia and the quantum industry. Done in partnership with the NSF Institute for Robust Quantum Simulations (RQS) and the NSF Center for Quantum Networks (CQN).'
        },
        {
            id: 'bitcamp',
            title: 'Bitcamp',
            subtitle: "UMD's Annual Hackathon",
            date: { month: 'APR', day: '10' },
            description: "Maryland’s premier hackathon. UQA will be hosting specialized quantum tracks and hardware challenges. Don’t miss out on the largest hackathon at UMD!"
        }
    ];

    return (
        <div className="min-h-screen pb-24 px-6 w-full" style={{ background: '#09091F' }}>
            <div className="max-w-4xl mx-auto">

                {/* Header: pt-44 for nav bar clearance & light typography */}
                <div className="pt-28 mb-20">
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
                        Upcoming <span className="text-[#9B6EFF]">Events</span>
                    </h1>
                </div>

                {/* Event List */}
                <div className="flex flex-col gap-6">
                    {eventList.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-[2.2rem] border border-white/5 overflow-hidden transition-all duration-300"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        >
                            <div
                                className="p-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                                onClick={() => setOpenEvent(openEvent === event.id ? null : event.id)}
                            >
                                <div className="flex items-center gap-8">
                                    {/* Date Badge */}
                                    <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center border border-[#9B6EFF]/20 shrink-0"
                                         style={{ backgroundColor: 'rgba(155, 110, 255, 0.1)' }}>
                                        <span className="text-[#9B97C2] text-xs font-bold tracking-widest">{event.date.month}</span>
                                        <span className="text-white text-3xl font-bold">{event.date.day}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{event.title}</h3>
                                        <p className="text-[#9B97C2] text-sm font-light tracking-wide">{event.subtitle}</p>
                                    </div>
                                </div>

                                {/* Interaction Button */}
                                <div className="w-10 h-10 rounded-xl border border-[#9B6EFF]/30 flex items-center justify-center shrink-0"
                                     style={{ backgroundColor: 'rgba(155, 110, 255, 0.05)' }}>
                  <span className={`text-[#9B6EFF] text-2xl transition-transform duration-300 ${openEvent === event.id ? 'rotate-45' : ''}`}>
                    +
                  </span>
                                </div>
                            </div>

                            {/* Accordion Content */}
                            {openEvent === event.id && (
                                <div className="px-8 pb-8 pt-2">
                                    <div className="h-px w-full bg-white/5 mb-6" />
                                    <p className="text-lg text-[#9B97C2] leading-relaxed font-light">
                                        {event.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 p-8 rounded-[2rem] border border-white/5 text-center"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                    <p className="text-[#9B97C2] italic font-light tracking-wide">
                        More events are currently being planned. Check the <a href="#calendar" className="text-[#9B6EFF] underline decoration-[#9B6EFF]/30 underline-offset-4 font-medium">Calendar</a> tab for the full schedule.
                    </p>
                </div>

            </div>
        </div>
    );
};
