import React from 'react';
import { Newspaper, Download, ExternalLink } from 'lucide-react';

export default function Press() {
  const releases = [
    { date: "Oct 12, 2023", title: "TecMart Secures $10M Series A Funding", publisher: "TechCrunch" },
    { date: "Aug 05, 2023", title: "The Future of Sustainable Marketplaces", publisher: "Forbes" },
    { date: "Jun 22, 2023", title: "TecMart Reaches 1M Active Users", publisher: "Business Insider" },
  ];

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="section-header text-center">
          <h1>Press & Media</h1>
          <p>
            Get the latest news, announcements, and media assets from TecMart.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="btn btn-primary">
            <Download size={18} /> Download Brand Kit
          </button>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold border-b pb-4" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}>Recent Press Coverage</h2>
          <div className="grid gap-6">
            {releases.map((release, idx) => (
              <a key={idx} href="#" className="card flex flex-col sm:flex-row sm:items-center justify-between p-6 group" style={{ textDecoration: 'none' }}>
                <div className="space-y-1">
                  <span className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--color-primary)' }}>{release.publisher}</span>
                  <h3 className="text-xl font-bold transition" style={{ color: 'var(--color-text-primary)' }}>{release.title}</h3>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{release.date}</p>
                </div>
                <ExternalLink className="hidden sm:block transition mt-4 sm:mt-0" style={{ color: 'var(--color-border-hover)' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
