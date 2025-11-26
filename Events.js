import React, { useState } from 'react';

export default function Events({ defaultUrl }) {
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState(defaultUrl || '');

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="bg-white rounded-lg shadow-sm p-12">
        <h2 className="text-4xl font-light text-slate-800 mb-8">Events Calendar</h2>

        <div className="mb-8">
          <p className="text-sm text-slate-600 mb-3">
            This page shows our Google Calendar for upcoming events. If you need to change the calendar,
            paste a Google Calendar embed "src" URL here (or the full Google embed URL). Example:
            <span className="block font-mono text-xs text-slate-500 mt-1">https://calendar.google.com/calendar/embed?src=your_calendar_id%40group.calendar.google.com&ctz=America%2FNew_York</span>
          </p>

          <input
            type="text"
            value={calendarEmbedUrl}
            onChange={(e) => setCalendarEmbedUrl(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-md mb-4"
            placeholder="Paste Google Calendar embed URL here..."
          />

          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              title="UMD UQA Calendar"
              src={calendarEmbedUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              frameBorder="0"
              scrolling="no"
              aria-hidden="false"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-6 text-slate-600">
          <p>
            If you'd like to show specific event cards beneath the calendar instead, I can re-add
            the events list or pull events dynamically from the Calendar API — tell me which you prefer.
          </p>
        </div>
      </div>
    </div>
  );
}