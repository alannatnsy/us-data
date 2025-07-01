import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchPopulationData } from "../api/dataService";
import "../contents/css/Data.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPopulationData();
        console.log("LineChart data:", result);
        if (result && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.error("Unexpected data format:", result);
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const years = data && Array.isArray(data) ? [...new Set(data.map(item => item.Year))].sort((a, b) => b - a) : [];

  const filteredEndYear = startYear ? years.filter(year => year >= startYear) : years;

  const allYearsData = {
    labels: data.map(item => item.Year || 0),
    datasets: [
      {
        label: "Population",
        data: data.map(item => item.Population || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const periodData = startYear && endYear && startYear <= endYear
    ? {
        labels: data.map(item => item.Year || 0).filter(year => year >= startYear && year <= endYear),
        datasets: [
          {
            label: "Population",
            data: data
              .filter(item => item.Year >= startYear && item.Year <= endYear)
              .map(item => item.Population || 0),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            tension: 0.1,
          },
        ],
      }
    : { labels: [], datasets: [{ data: [] }] };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#FFFFFF",
        },
      },
      title: {
        display: true,
        text: "Population Over Time",
        color: "#FFFFFF",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Population",
          color: "#FFFFFF",
        },
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const periodOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: `Population from ${startYear} to ${endYear}`,
        color: "#FFFFFF",
      },
    },
  };

  const handleStartYearChange = (e) => {
    const newStartYear = e.target.value;
    setStartYear(newStartYear);
    if (endYear && newStartYear && endYear < newStartYear){
      setEndYear(newStartYear);
    }
  }

  return (
    <div className="line-container">
      <h1>Population Trends</h1>
      <div className="mb-4">
        <label htmlFor="startYear" className="mr-2">Start Year:</label>
        <select
          id="startYear"
          value={startYear}
          onChange={handleStartYearChange}
          className="dropdown"
        >
          <option value="">Select Start Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <label htmlFor="endYear" className="mr-2 ml-4">End Year:</label>
        <select
          id="endYear"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="dropdown"
        >
          <option value="">Select End Year</option>
          {filteredEndYear.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <Line data={allYearsData} options={options} />
      {(startYear && endYear && startYear <= endYear) && (
        <Line data={periodData} options={periodOptions} />
      )}
    </div>
  );
};
export default LineChart;