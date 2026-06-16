import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import AutoResizeTextarea from './AutoResizeTextarea';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function SessionCard({ session, index }) {
  const { updateSession } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [formData, setFormData] = useState({ ...session });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => {
    setFormData({ ...session });
  }, [session]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (saveTimeout) clearTimeout(saveTimeout);
    setIsSaving(true);
    
    const timeout = setTimeout(async () => {
      await updateSession(session.rowIndex, newData);
      setIsSaving(false);
    }, 1000);
    
    setSaveTimeout(timeout);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        className="px-6 py-4 cursor-pointer flex items-center justify-between bg-white select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
            {formData.sessionNumber}
          </div>
          <div>
            <h3 className={clsx("font-semibold text-lg transition-colors", formData.topic ? "text-slate-900" : "text-slate-400 italic")}>
              {formData.topic || 'Untitled Session'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {isSaving && <span className="text-xs text-slate-400 animate-pulse">Saving...</span>}
            </div>
          </div>
        </div>
        
        <ChevronDown className={clsx("w-5 h-5 text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} />
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 gap-4 mt-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic (หัวข้อ)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Objective (จุดประสงค์)</label>
              <AutoResizeTextarea 
                rows={2}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.objective}
                onChange={(e) => handleChange('objective', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Activity (กิจกรรม)</label>
              <AutoResizeTextarea 
                rows={2}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.activity}
                onChange={(e) => handleChange('activity', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Homework (การบ้าน)</label>
                <AutoResizeTextarea 
                  rows={2}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.homework}
                  onChange={(e) => handleChange('homework', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Note (หมายเหตุ)</label>
                <AutoResizeTextarea 
                  rows={2}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
