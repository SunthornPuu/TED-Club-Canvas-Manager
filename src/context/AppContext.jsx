import { createContext, useContext, useState, useEffect } from 'react';
import { 
  authenticateUser, 
  checkUserSheetExists, 
  createUserSheet, 
  fetchCanvasData, 
  updateStaticDataRow,
  updateSessionRow, 
  appendSessionRow, 
  reduceLastSessionRow 
} from '../services/googleSheets';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [sessions, setSessions] = useState([]);
  const [staticData, setStaticData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (user) setError(null); }, [user]);

  const login = async (leader, buddy) => {
    setLoading(true);
    setError(null);
    try {
      const isValid = await authenticateUser(leader, buddy);
      if (isValid) {
        setUser({ leader, buddy });
        return true;
      } else {
        setError('Invalid Leader or Buddy name.');
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSessions([]);
    setStaticData({});
  };

  const checkSetup = async (customLeader) => {
    const leaderToUse = customLeader || user?.leader;
    setLoading(true);
    try {
      const exists = await checkUserSheetExists(leaderToUse);
      return exists;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const initializeSheet = async (numSessions) => {
    setLoading(true);
    try {
      await createUserSheet(user.leader, numSessions);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { staticData: sd, sessions: s } = await fetchCanvasData(user.leader);
      setStaticData(sd);
      setSessions(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStaticData = async (newData) => {
    try {
      setStaticData(prev => ({ ...prev, ...newData }));
      await updateStaticDataRow(user.leader, { ...staticData, ...newData });
    } catch (err) {
      setError('Failed to save static data updates.');
    }
  };

  const updateSession = async (rowIndex, updatedData) => {
    try {
      setSessions(prev => prev.map(s => s.rowIndex === rowIndex ? { ...s, ...updatedData } : s));
      await updateSessionRow(user.leader, rowIndex, updatedData);
    } catch (err) {
      setError('Failed to save session updates.');
    }
  };

  const addSession = async () => {
    setLoading(true);
    try {
      const newSessionNum = sessions.length + 1;
      await appendSessionRow(user.leader, newSessionNum);
      await loadData(); 
    } catch (err) {
      setError('Failed to add session.');
    } finally {
      setLoading(false);
    }
  };

  const reduceSession = async () => {
    if (sessions.length === 0) return;
    setLoading(true);
    try {
      await reduceLastSessionRow(user.leader);
      await loadData(); 
    } catch (err) {
      setError('Failed to remove session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      sessions,
      staticData,
      loading,
      error,
      login,
      logout,
      checkSetup,
      initializeSheet,
      loadData,
      updateStaticData,
      updateSession,
      addSession,
      reduceSession
    }}>
      {children}
    </AppContext.Provider>
  );
};
