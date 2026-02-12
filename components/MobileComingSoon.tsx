"use client";

import React from "react";
import { GithubIcon } from "./Icons";

export default function MobileComingSoon() {
  return (
    <div className="mobile-coming-soon">
      <div className="mobile-content">

                {/* Main Content */}
        <div className="mobile-text">
          <h1 className="mobile-title">DawnMark</h1>
          <h2 className="mobile-subtitle">Professional Markdown Editor</h2>
          <p className="mobile-description">
            DawnMark is optimized for desktop and larger screens to provide the best 
            editing experience with side-by-side preview and full feature access.
          </p>
        </div>

        {/* Status */}
        <div className="mobile-status">
          <div className="status-badge">
            <div className="status-dot"></div>
            <span>Mobile version coming soon</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mobile-actions">
          <p className="mobile-suggestion">
            For the best experience, please visit DawnMark on a desktop or tablet device.
          </p>
          <div className="action-buttons">
            <a 
              href="https://github.com/7sg56/dawnmark-v3" 
              className="mobile-btn mobile-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon size={20} />
              View on GitHub
            </a>
            <button 
              className="mobile-btn mobile-btn-secondary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mobile-footer">
          <p>Made by <a href="https://github.com/7sg56" target="_blank" rel="noopener noreferrer">Sourish Ghosh</a></p>
        </div>
      </div>
    </div>
  );
}