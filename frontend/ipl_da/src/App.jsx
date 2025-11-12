import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Scatter from "./pages/Scatter";
import PlayerMatchupPage from "./pages/PlayerMatchupPage";
import PlayerRoleAnalysisPage from './pages/PlayerRoleAnalysisPage';
import PlayerTypeAgainstAnalysisPage from './pages/PlayerTypeAgainstAnalysisPage';
import PlayerStats from './components/PlayerStats/PlayerStats';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlayerShotAnalysisPage from './pages/PlayerShotAnalysisPage';
import PlayerBowlTypeAnalysisPage from "./pages/PlayerBowlTypeAnalysisPage";
import PlayerWagonWheelPage from "./pages/PlayerWagonWheelPage";
import CompareBatterSkillPage from "./pages/CompareBatterSkillPage";
import CompareBowlerSkillPage from "./pages/CompareBowlerSkillPage";
import BatterHeatmapPage from "./pages/BatterHeatmapPage"
import BowlerHeatmapPage from "./pages/BowlerHeatmapPage"
import BatterWeakZoneAnalysis from "./components/BatterWeakZoneAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/scatter" element={<Scatter />} />
          <Route path="/player-matchup" element={<PlayerMatchupPage/>} />
          <Route path="/player/:player" element={<PlayerStats />} />
          <Route path="/player/:player/phase-analysis" element={<PlayerRoleAnalysisPage />} />
          <Route path="/player/:player/type-against-analysis" element={<PlayerTypeAgainstAnalysisPage />} />
          <Route path="/player/:player/shot-analysis" element={<PlayerShotAnalysisPage />} />
          <Route path="/player/:player/bowltype-analysis" element={<PlayerBowlTypeAnalysisPage />} />
          <Route path="/player/:player/batter-wagon" element={<PlayerWagonWheelPage />} />
          <Route path="/player/:player/batterzone-analysis" element={<BatterWeakZoneAnalysis />} />
          <Route path="/compare-batter" element={<CompareBatterSkillPage />} />
          <Route path="/compare-bowler" element={<CompareBowlerSkillPage />} />
          <Route path="/batter-heatmap" element={<BatterHeatmapPage />} />
          <Route path="/bowler-heatmap" element={<BowlerHeatmapPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;