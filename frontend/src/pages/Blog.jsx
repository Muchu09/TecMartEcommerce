import React from 'react';
import { BookOpen, UserCircle, Calendar } from 'lucide-react';

export default function Blog() {
  const posts = [
    { title: "Top 10 Tips for Selling Your Electronics Safely", category: "Guides", read: "5 min read", date: "Nov 02" },
    { title: "How TecMart is Reducing E-Waste Globally", category: "Sustainability", read: "8 min read", date: "Oct 18" },
    { title: "The Ultimate Guide to Peer-to-Peer Rentals", category: "Economics", read: "6 min read", date: "Sep 24" },
    { title: "Meet the Team: Engineering at TecMart", category: "Culture", read: "4 min read", date: "Sep 05" },
  ];

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="section-header text-center">
          <h1>TecMart Blog</h1>
          <p>
            Insights, stories, and tips from the community and our team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <article key={idx} className="card cursor-pointer group flex flex-col h-full">
              <div className="mb-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {post.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3 transition" style={{ color: 'var(--color-text-primary)' }}>
                {post.title}
              </h2>
              <div className="flex-1"></div>
              <div className="flex items-center gap-4 text-sm font-medium pt-6 mt-4" style={{ color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)' }}>
                <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1"><BookOpen size={14} /> {post.read}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
