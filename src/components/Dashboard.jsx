import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SessionCard from './SessionCard';
import CanvasRender from './CanvasRender';
import AutoResizeTextarea from './AutoResizeTextarea';
import { Loader2, Plus, Minus, LogOut, Camera, ChevronDown } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function Dashboard() {
  const { user, sessions, staticData, updateStaticData, loadData, addSession, reduceSession, loading, logout } = useAppContext();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [staticForm, setStaticForm] = useState(staticData || {});
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [isStaticSaving, setIsStaticSaving] = useState(false);
  const [staticExpanded, setStaticExpanded] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStaticForm(staticData || {});
  }, [staticData]);

  const handleStaticChange = (field, value) => {
    const newData = { ...staticForm, [field]: value };
    setStaticForm(newData);
    
    if (saveTimeout) clearTimeout(saveTimeout);
    setIsStaticSaving(true);
    
    const timeout = setTimeout(async () => {
      await updateStaticData(newData);
      setIsStaticSaving(false);
    }, 1000);
    
    setSaveTimeout(timeout);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `TED_Club_Canvas_${user.leader}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas', err);
      alert(`Export Error: ${err.message || err.toString()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {user?.leader}'s Canvas
            </h1>
            <p className="text-slate-500 mt-1">Manage your TED Club sessions and export your canvas</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExport}
              disabled={isExporting || loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              Export to Image
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-full font-medium transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {loading && sessions.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Static Data Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div 
                className="px-6 py-4 cursor-pointer flex items-center justify-between bg-white select-none border-b border-slate-100"
                onClick={() => setStaticExpanded(!staticExpanded)}
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-lg text-slate-900">Canvas Configuration</h2>
                  {isStaticSaving && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Saving...</span>}
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${staticExpanded ? 'rotate-180' : ''}`} />
              </div>
              
              {staticExpanded && (
                <div className="p-6 bg-slate-50/50 space-y-6">
                  {/* Top Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Persona (เด็กนักเรียน)</label>
                      <AutoResizeTextarea rows={3} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-blue-500 outline-none" value={staticForm.persona || ''} onChange={e => handleStaticChange('persona', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Agreement (ข้อตกลง)</label>
                      <AutoResizeTextarea rows={3} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-blue-500 outline-none" value={staticForm.agreement || ''} onChange={e => handleStaticChange('agreement', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Concept</label>
                      <AutoResizeTextarea rows={3} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-blue-500 outline-none" value={staticForm.concept || ''} onChange={e => handleStaticChange('concept', e.target.value)} />
                    </div>
                  </div>

                  {/* Risks & Solutions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-orange-600 mb-1">Risk 1 (ความเสี่ยง 1)</label>
                        <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-orange-500 outline-none" value={staticForm.risk1 || ''} onChange={e => handleStaticChange('risk1', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Solution 1 (วิธีแก้ไข 1)</label>
                          <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-green-500 outline-none" value={staticForm.risk1_sol1 || ''} onChange={e => handleStaticChange('risk1_sol1', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Solution 2 (วิธีแก้ไข 2)</label>
                          <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-green-500 outline-none" value={staticForm.risk1_sol2 || ''} onChange={e => handleStaticChange('risk1_sol2', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-orange-600 mb-1">Risk 2 (ความเสี่ยง 2)</label>
                        <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-orange-500 outline-none" value={staticForm.risk2 || ''} onChange={e => handleStaticChange('risk2', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Solution 1 (วิธีแก้ไข 1)</label>
                          <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-green-500 outline-none" value={staticForm.risk2_sol1 || ''} onChange={e => handleStaticChange('risk2_sol1', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Solution 2 (วิธีแก้ไข 2)</label>
                          <AutoResizeTextarea rows={2} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-green-500 outline-none" value={staticForm.risk2_sol2 || ''} onChange={e => handleStaticChange('risk2_sol2', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Global Note */}
                  <div className="border-t border-slate-200 pt-6">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Global Note (หมายเหตุรวม)</label>
                    <AutoResizeTextarea rows={3} className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-blue-500 outline-none" value={staticForm.globalNote || ''} onChange={e => handleStaticChange('globalNote', e.target.value)} />
                  </div>

                </div>
              )}
            </div>

            {/* Sessions Header */}
            <div className="flex items-center justify-between pt-6 pb-2">
              <h2 className="text-xl font-bold text-slate-900">Sessions</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={reduceSession}
                  disabled={loading || sessions.length === 0}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors shadow-sm disabled:opacity-50"
                  title="Remove Last Session"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={addSession}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full font-medium transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Sessions List */}
            {sessions.map((session, index) => (
              <SessionCard key={session.rowIndex} session={session} index={index} />
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                <p className="text-slate-500">No sessions yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden Render Container for Canvas Image */}
      <div style={{ position: 'fixed', top: '200vh', left: '0', pointerEvents: 'none' }}>
        <CanvasRender ref={canvasRef} staticData={staticForm} sessions={sessions} />
      </div>
    </div>
  );
}
