import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const BattingStatsScatterplot = () => {
  const [scatterData, setScatterData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [strikeRateRange, setStrikeRateRange] = useState({ min: 0, max: 250 });
  const [averageRange, setAverageRange] = useState({ min: 0, max: 100 });
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/batscatter')
      .then(response => {
        const formattedData = response.data.map(item => ({
          x: parseFloat(item.strike_rate),
          y: parseFloat(item.average),
          batsman: item.batsman
        }));
        setScatterData(formattedData);
        setFilteredData(formattedData);
      })
      .catch(error => console.error('Error fetching scatter plot data:', error));
  }, []);

  useEffect(() => {
    if (scatterData) {
      const filtered = scatterData.filter(item => 
        item.x >= strikeRateRange.min && item.x <= strikeRateRange.max &&
        item.y >= averageRange.min && item.y <= averageRange.max &&
        item.batsman.toLowerCase().includes(nameFilter.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [scatterData, strikeRateRange, averageRange, nameFilter]);

  if (!filteredData) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const data = {
    datasets: [
      {
        label: 'Batsmen Stats',
        data: filteredData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Tailwind blue-500 with opacity
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Strike Rate',
          color: '#ffffff', // White text for dark mode
        },
        ticks: {
          color: '#ffffff', // White text for dark mode
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Average',
          color: '#ffffff', // White text for dark mode
        },
        ticks: {
          color: '#ffffff', // White text for dark mode
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.batsman}: Strike Rate: ${point.x.toFixed(2)}, Average: ${point.y.toFixed(2)}`;
          },
        },
      },
      legend: {
        labels: {
          color: '#ffffff', // White text for dark mode
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-block mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Back to Home
          </button>
        </Link>
        
        <h2 className="text-3xl font-bold mb-8 text-center">Batting Statistics: Strike Rate vs Average</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-2">Strike Rate Range:</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                value={strikeRateRange.min} 
                onChange={(e) => setStrikeRateRange({...strikeRateRange, min: parseFloat(e.target.value)})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
              <input 
                type="number" 
                value={strikeRateRange.max} 
                onChange={(e) => setStrikeRateRange({...strikeRateRange, max: parseFloat(e.target.value)})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Average Range:</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                value={averageRange.min} 
                onChange={(e) => setAverageRange({...averageRange, min: parseFloat(e.target.value)})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
              <input 
                type="number" 
                value={averageRange.max} 
                onChange={(e) => setAverageRange({...averageRange, max: parseFloat(e.target.value)})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Batsman Name:</label>
            <input 
              type="text" 
              value={nameFilter} 
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Enter batsman name"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg" style={{ height: '600px' }}>
          <Scatter data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BattingStatsScatterplot;