import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CastPage } from './pages/CastPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { PlanningPage } from './pages/PlanningPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultsPage } from './pages/ResultsPage';

const App = () => (
  <AppShell>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/plan" element={<PlanningPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/cast" element={<CastPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </AppShell>
);

export default App;
