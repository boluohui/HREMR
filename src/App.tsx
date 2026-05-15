import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import AddRecord from './pages/AddRecord';
import RecordDetail from './pages/RecordDetail';
import Examinations from './pages/Examinations';
import ExamDetail from './pages/ExamDetail';
import Prescriptions from './pages/Prescriptions';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="records/add" element={<AddRecord />} />
          <Route path="records/:id" element={<RecordDetail />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="examinations/:id" element={<ExamDetail />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
