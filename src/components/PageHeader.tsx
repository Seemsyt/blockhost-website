import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  highlightedTitle?: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<Props> = ({
  badge,
  badgeIcon,
  title,
  highlightedTitle,
  description,
  crumbs = []
}) => {
  return (
    <div className="pt-28 pb-12 sm:pb-16 relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#070a12] to-[#090d16] border-b border-slate-800/80">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs font-mono-code text-slate-400 mb-6">
          <Link
            to="/"
            onClick={() => soundManager.playPop()}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  onClick={() => soundManager.playPop()}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-200 font-bold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Content */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-emerald-400">
            {badgeIcon}
            <span>{badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}{' '}
            {highlightedTitle && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {highlightedTitle}
              </span>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
