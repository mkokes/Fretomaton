import React from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const DaisyUIDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">DaisyUI Components Demo</h1>
      
      {/* Alerts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Alerts</h2>
        <div className="alert alert-info">
          <Info className="w-6 h-6" />
          <span>This is an info alert with the silk theme!</span>
        </div>
        <div className="alert alert-success">
          <CheckCircle className="w-6 h-6" />
          <span>Success! Your changes have been saved.</span>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle className="w-6 h-6" />
          <span>Warning: Please check your input.</span>
        </div>
        <div className="alert alert-error">
          <XCircle className="w-6 h-6" />
          <span>Error! Something went wrong.</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-neutral">Neutral</button>
          <button className="btn btn-ghost">Ghost</button>
          <button className="btn btn-outline">Outline</button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>This is a beautiful card with the silk theme styling.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Primary Card</h2>
              <p>This card uses the primary color scheme.</p>
              <div className="card-actions justify-end">
                <button className="btn">Action</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Field</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select</span>
            </label>
            <select className="select select-bordered">
              <option disabled selected>Pick one</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress and Loading */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Progress & Loading</h2>
        <progress className="progress progress-primary w-56" value="70" max="100"></progress>
        <div className="flex gap-4">
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-dots loading-md"></span>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Stats</h2>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-title">New Registers</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↗︎ 90 (14%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaisyUIDemo;
