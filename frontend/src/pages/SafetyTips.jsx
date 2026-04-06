import React from 'react';
import { Shield, Lock, AlertTriangle, UserCheck } from 'lucide-react';

export default function SafetyTips() {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="section-header text-center">
          <h1>Community Safety Tips</h1>
          <p>Your safety is our top priority. Please review these guidelines before interacting.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card flex gap-4">
            <div style={{ color: 'var(--color-primary)' }}><Lock size={28} /></div>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Protect Your Information</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Never share your password, banking details, or exact home address with users. Keep communication within our platform.</p>
            </div>
          </div>

          <div className="card flex gap-4">
            <div style={{ color: 'var(--color-success)' }}><Shield size={28} /></div>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Meet in Public</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Always arrange to meet in well-lit, public spaces like coffee shops, local police stations, or shopping centers.</p>
            </div>
          </div>

          <div className="card flex gap-4">
            <div style={{ color: 'var(--color-warning)' }}><UserCheck size={28} /></div>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Inspect Items Carefully</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Take your time to thoroughly inspect an item before finalizing a transaction. Ask questions if you're unsure.</p>
            </div>
          </div>

          <div className="card flex gap-4">
            <div style={{ color: 'var(--color-danger)' }}><AlertTriangle size={28} /></div>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Report Suspicious Activity</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>If a deal feels too good to be true, it probably is. Use the report button if you encounter anything shady.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
