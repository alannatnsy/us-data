import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchPopulationData } from "../api/dataService";
import "../contents/css/Data.css";
import { color } from "chart.js/helpers";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPopulationData();
        console.log("PieChart data :", result);
        if (result && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.error("Unexpected data format: ", result);
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error("Fetch error: ", error);
        setLoading(False);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>

  const years = data && Array.isArray(data) ? [...new Set(data.map(item => item.Year))].sort((a, b) => b - a) : [];

  const filteredEndYear = startYear ? years.filter(year => year >= startYear) : years;

  const allYearsData = {
    labels: data.map(item => item.Year || "Unknown"),
    datasets: [
      {
        label: "Population",
        data: data.map(item => item.Population || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(244, 67, 54, 0.6)",
          "rgba(165, 149, 56, 0.6)",
          "rgba(121, 37, 95, 0.6)",
          "rgba(54, 41, 231, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(200, 216, 128, 1)",
          "rgba(150, 205, 163, 1)",
          "rgba(228, 144, 203, 1)",
          "rgba(138, 143, 159, 1)",
          "rgb(160, 147, 103)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const periodData = startYear && endYear && startYear <= endYear ? {
    labels: data.map(item => item.Year || "Unknown").filter(year => year >= startYear && year <= endYear),
    datasets: [
      {
        label: "Population",
        data: data
          .filter(item => item.Year >= startYear && item.Year <= endYear)
          .map(item => item.Population || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(244, 67, 54, 0.6)",
          "rgba(58, 80, 154, 0.6)",
          "rgba(121, 37, 95, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(200, 216, 128, 1)",
          "rgba(150, 205, 163, 1)",
          "rgba(228, 144, 203, 1)",
          "rgba(138, 143, 159, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }
  : { labels: [], datasets: [{ data: []}]};

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
        text: "Population Distribution Over Time",
        color: "#FFFFFF",
      },
    },
  };

  const periodOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: `Population Distribution from ${startYear} to ${endYear}`,
        color: "#FFFFFF",
      },
    },
  };

  const handleStartYearChange = (e) => {
    const newStartYear = e.target.value;
    setStartYear(newStartYear);
    if (endYear && newStartYear && endYear < newStartYear) {
      setEndYear(newStartYear);
    }
  };

  return (
    <div className="pie-container">
      <h1>Population Distribution</h1>
      <div ClassName="mb-4">
        <label htmlFor="startYear" className="mr-2">
          Start Year:
        </label>
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
        <label htmFor="endYear" className="mr-2 ml-4">
          End Year:
        </label>
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
      <Pie data={allYearsData} options={options} />
      {(startYear && endYear && startYear <= endYear) && (
        <Pie data={periodData} options={periodOptions} />
      )}
    </div>
  );
};

export default PieChart;