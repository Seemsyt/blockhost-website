import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, AlertCircle, KeyRound } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { apiFetch, setAuthToken, ApiError } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [otp, setOtp] = useState('');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (pendingVerificationEmail) {
        const data = await apiFetch('/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ email: pendingVerificationEmail, otp })
        });
        setAuthToken(data.access_token);
        login(data.access_token, data.user);
        soundManager.playLevelUp();
        onClose();
        if (onSuccess) onSuccess();
      } else if (isLogin) {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        setAuthToken(data.access_token);
        login(data.access_token, data.user);
      } else {
        const data = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ email, password, nickname })
        });
        setPendingVerificationEmail(data.email || email);
        setOtp('');
        setNotice(data.message || 'Check your email for the verification code.');
      }
    } catch (err: any) {
      soundManager.playPop();
      if (err instanceof ApiError) {
        // Detect the "verification_required" 403 from login and redirect
        // to the OTP flow instead of showing a dead-end error message.
        if (err.status === 403 && err.data?.detail?.status === 'verification_required') {
          const verifyEmail = err.data.detail.email || email;
          setPendingVerificationEmail(verifyEmail);
          setOtp('');
          setNotice(err.data.detail.message || 'A new verification code has been sent to your email.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingVerificationEmail) return;
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const data = await apiFetch('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: pendingVerificationEmail })
      });
      setNotice(data.message || 'A new verification code was sent.');
      soundManager.playPop();
    } catch (err: any) {
      soundManager.playPop();
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 relative overflow-hidden"
      >
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-6">
          {pendingVerificationEmail ? 'Verify Email' : (isLogin ? 'Welcome Back' : 'Create Account')}
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {pendingVerificationEmail ? (
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="123456"
                />
              </div>
            </div>
          ) : !isLogin && (
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Nickname</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Steve"
                />
              </div>
            </div>
          )}

          {!pendingVerificationEmail && (
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="steve@mojang.com"
                />
              </div>
            </div>
          )}

          {!pendingVerificationEmail && (
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {!isLogin && !pendingVerificationEmail && (
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="legal-accept"
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                className="mt-1 bg-slate-950 border border-slate-800 rounded checked:bg-emerald-500 focus:ring-emerald-500 text-emerald-500"
              />
              <label htmlFor="legal-accept" className="text-xs text-slate-400 leading-tight">
                I agree to the <a href="/terms" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>,{' '}
                <a href="/aup" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Acceptable Use Policy</a>, and{' '}
                <a href="/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!isLogin && !pendingVerificationEmail && !legalAccepted)}
            className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Please wait...' : (pendingVerificationEmail ? 'Verify' : (isLogin ? 'Login' : 'Sign Up'))}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {pendingVerificationEmail ? (
            <>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-emerald-400 font-bold hover:underline disabled:opacity-50"
              >
                Resend Code
              </button>
              <span className="mx-2">·</span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setPendingVerificationEmail(null);
                  setOtp('');
                  setNotice(null);
                  setError(null);
                }}
                className="text-slate-300 font-bold hover:underline"
              >
                Change Email
              </button>
            </>
          ) : (
            <>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setIsLogin(!isLogin);
                  setError(null);
                  setNotice(null);
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
