import { useState, useEffect } from "react";
import Card from "../components/Card";
import { fetchPopulationData } from "../api/dataService";
import "../contents/css/Data.css";

function Data() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchPopulationData();
                setData(result.data || []);
                if ((result.data || []).length > 0) {
                    setSelectedYear(result.data[0].Year);
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>;

    const years = [...new Set(data.map(item => item.Year))].sort((a, b) => a - b);
    const filteredData = selectedYear ? data.filter(item => item.Year === selectedYear) : data;

    return (
        <div className="data-container">
            <h1>United States Population Data</h1>
            <div className="mb-4">
                <label htmlFor="yearSelect" className="mr-2">
                    Select Year :
                </label>
                <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="dropdown"
                >
                    <option value="">All Years</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <Card
                        key={item.ID}
                        year={item.Year}
                        population={item.Population}
                        nation={item.Nation}
                    />
                ))
            ) : (
                <p>No data available for the selected year.</p>
            )}
        </div>
    );
}

export default Data;