import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, LogIn, AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function AdminLogin() {
  const { signInWithGoogle, signInWithPassword, signInAsDevAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithPassword(email, password);
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Intenta de nuevo.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión con Google.');
      setGoogleLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInAsDevAdmin();
    } catch (err: any) {
      setError(err?.message || 'Error al simular inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ucb-lightyellow via-white to-ucb-lightyellow flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-block mb-4">
            <div className="w-16 h-16 bg-ucb-blue rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Ingresa con tus credenciales para acceder al dashboard.</p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-xl border-t-4 border-ucb-yellow p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-base border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-ucb-blue rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}</span>
          </button>

          <button
            type="button"
            onClick={handleDevLogin}
            disabled={googleLoading || loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-base border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Simular inicio de sesión de administrador
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">o con correo y contraseña</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ucb.edu.bo"
                  className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-ucb-blue focus:outline-none transition-colors"
                  disabled={loading || googleLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-ucb-blue focus:outline-none transition-colors"
                  disabled={loading || googleLoading}
                  required
                />
              </div>
            </div>

            <motion.button
              id="btn-email-login"
              type="submit"
              disabled={loading || googleLoading || !password || !email}
              whileHover={{ scale: !loading && password && email ? 1.02 : 1 }}
              whileTap={{ scale: !loading && password && email ? 0.98 : 1 }}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                !loading && password && email
                  ? 'bg-ucb-yellow hover:bg-yellow-500 text-ucb-dark shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-ucb-dark rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Ingresar</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
