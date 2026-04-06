import React from 'react';
import { Shield, Users, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header Section */}
        <div className="section-header text-center">
          <h1>About TecMart</h1>
          <p>
            We are building the future of community-driven marketplaces. Rent, sell, and discover items nearby with ease and security.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="card">
            <Target className="text-primary w-12 h-12 mb-4" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Our Mission</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.625' }}>
              To empower communities by providing a secure, seamless, and transparent platform for circulating goods, reducing waste, and fostering local connections.
            </p>
          </div>
          <div className="card">
            <Shield className="w-12 h-12 mb-4" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Our Vision</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.625' }}>
              A world where sustainable commerce is the default, and everyone has access to the tools and items they need without unnecessary consumption.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="card text-center space-y-10" style={{ background: 'var(--color-primary-dark)', color: 'var(--color-text-inverse)' }}>
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Zap className="w-10 h-10 mx-auto" style={{ color: 'var(--color-primary-light)' }} />
              <h3 className="text-xl font-semibold">Fast & Reliable</h3>
              <p style={{ color: 'var(--color-primary-light)', opacity: 0.9 }}>Optimized infrastructure for lightning-fast browsing and transactions.</p>
            </div>
            <div className="space-y-3">
              <Shield className="w-10 h-10 mx-auto" style={{ color: 'var(--color-primary-light)' }} />
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p style={{ color: 'var(--color-primary-light)', opacity: 0.9 }}>State-of-the-art encryption combined with cash-on-delivery flexibility.</p>
            </div>
            <div className="space-y-3">
              <Users className="w-10 h-10 mx-auto" style={{ color: 'var(--color-primary-light)' }} />
              <h3 className="text-xl font-semibold">Community First</h3>
              <p style={{ color: 'var(--color-primary-light)', opacity: 0.9 }}>Built by the community, for the community. We value human connection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
