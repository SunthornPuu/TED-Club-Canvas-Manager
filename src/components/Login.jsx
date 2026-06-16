import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [leader, setLeader] = useState('');
  const [buddy, setBuddy] = useState('');
  const { login, checkSetup, loading, error } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(leader, buddy);
    if (success) {
      const exists = await checkSetup(leader);
      if (exists) {
        navigate('/dashboard');
      } else {
        navigate('/setup');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-tedx-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-tedx-gray-200" style={{boxShadow: '0 2px 8px rgba(230, 43, 31, 0.1)'}}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-tedx-black mb-2">TED Club</h1>
          <p className="text-tedx-gray-500">Sign in to manage your canvas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-tedx-gray-700 mb-2">Leader Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border border-tedx-gray-200 focus:ring-2 focus:ring-tedx-red focus:border-tedx-red outline-none transition-all"
              placeholder="Enter your name"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tedx-gray-700 mb-2">Buddy Name</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg border border-tedx-gray-200 focus:ring-2 focus:ring-tedx-red focus:border-tedx-red outline-none transition-all"
              placeholder="Enter buddy password"
              value={buddy}
              onChange={(e) => setBuddy(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-tedx-red rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !leader || !buddy}
            className="btn-tedx-primary w-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
