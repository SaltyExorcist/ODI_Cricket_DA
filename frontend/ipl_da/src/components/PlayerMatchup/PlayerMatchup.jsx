import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';

function PlayerMatchup() {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [selectedBatsman, setSelectedBatsman] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');
  const [matchupData, setMatchupData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/players')
      .then(response => {
        setBatsmen(response.data);
        setBowlers(response.data);
      })
      .catch(error => console.error('Error fetching players:', error));
  }, []);

  const fetchMatchupData = () => {
    if (selectedBatsman && selectedBowler) {
      axios.get(`http://localhost:5000/api/player-matchup?batsman=${selectedBatsman}&bowler=${selectedBowler}`)
        .then(response => setMatchupData(response.data))
        .catch(error => console.error('Error fetching matchup data:', error));
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Player Matchup</h2>
        <div className="mb-8 space-y-4">
          <SearchBar
            items={batsmen}
            placeholder="Search for a batsman"
            onSelect={setSelectedBatsman}
          />
          <SearchBar
            items={bowlers}
            placeholder="Search for a bowler"
            onSelect={setSelectedBowler}
          />
          <button 
            onClick={fetchMatchupData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Get Matchup Data
          </button>
        </div>
        {matchupData && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">{selectedBatsman} vs {selectedBowler}</h3>
            <table className="w-full">
              <tbody>
                {Object.entries(matchupData).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-700">
                    <th className="py-2 text-left text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</th>
                    <td className="py-2 text-right">{value || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerMatchup;