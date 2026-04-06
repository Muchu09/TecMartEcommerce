import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Careers() {
  const jobs = [
    { title: "Senior Frontend Engineer", location: "Remote", type: "Full-time" },
    { title: "Product Manager", location: "New York, NY", type: "Full-time" },
    { title: "UX Designer", location: "San Francisco, CA", type: "Contract" },
    { title: "Marketing Specialist", location: "Remote", type: "Part-time" },
  ];

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="section-header text-center">
          <h1>Careers at TecMart</h1>
          <p>
            Join our fast-growing team and help shape the future of peer-to-peer commerce.
          </p>
        </div>

        <div className="card overflow-hidden" style={{ padding: 0 }}>
          <div className="p-8 border-b" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
             <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
               <Briefcase style={{ color: 'var(--color-primary)' }} /> Open Positions
             </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {jobs.map((job, idx) => (
              <div key={idx} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition" style={{ background: 'var(--color-bg)' }}>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
