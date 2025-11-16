import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const BowlingStatsScatterplot = () => {
  const [scatterData, setScatterData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [economyRange, setEconomyRange] = useState({ min: 0, max: 20 });
  const [averageRange, setAverageRange] = useState({ min: 0, max: 100 });
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/bowlscatter`)
      .then(response => {
        const formattedData = response.data.map(item => ({
          x: parseFloat(item.economy),
          y: parseFloat(item.average),
          bowler: item.bowler
        }));
        setScatterData(formattedData);
        setFilteredData(formattedData);
      })
      .catch(error => console.error('Error fetching scatter plot data:', error));
  }, []);

  useEffect(() => {
    if (scatterData) {
      const filtered = scatterData.filter(item => 
        item.x >= economyRange.min && item.x <= economyRange.max &&
        item.y >= averageRange.min && item.y <= averageRange.max &&
        item.bowler.toLowerCase().includes(nameFilter.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [scatterData, economyRange, averageRange, nameFilter]);

  if (!filteredData) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  const data = {
    datasets: [
      {
        label: 'Bowler Stats',
        data: filteredData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Tailwind green-500 with opacity
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
          text: 'Economy',
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
            return `${point.bowler}: Economy: ${point.x.toFixed(2)}, Average: ${point.y.toFixed(2)}`;
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
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Back to Home
          </button>
        </Link>
        
        <h2 className="text-3xl font-bold mb-8 text-center">Bowling Statistics: Economy vs Average</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-2">Economy Range:</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                value={economyRange.min} 
                onChange={(e) => setEconomyRange({...economyRange, min: parseFloat(e.target.value)})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
              <input 
                type="number" 
                value={economyRange.max} 
                onChange={(e) => setEconomyRange({...economyRange, max: parseFloat(e.target.value)})}
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
            <label className="block mb-2">Bowler Name:</label>
            <input 
              type="text" 
              value={nameFilter} 
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Enter bowler name"
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

export default BowlingStatsScatterplot;