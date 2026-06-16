import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Setup() {
  const [numSessions, setNumSessions] = useState(5);
  const { user, initializeSheet, loading, error } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await initializeSheet(numSessions);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Welcome, {user?.leader}! 🎉
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Let's build your foundation canvas. How many sessions do you plan to run for your TED Club?
        </p>

        <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-6">
          <div>
            <input 
              type="number" 
              min="1"
              max="50"
              required
              className="w-full text-center text-4xl px-4 py-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={numSessions}
              onChange={(e) => setNumSessions(parseInt(e.target.value) || 1)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Create Canvas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
