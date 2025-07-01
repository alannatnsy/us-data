import { useState, useEffect } from "react";

function Home() {
    const [info, setInfo] = useState({ source_name: "", source_description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://datausa.io/api/data?drilldowns=Nation&measures=Population");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                const { source_name, source_description } = result.source[0].annotations;
                setInfo({ source_name, source_description });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Source Information</h1>
            <div>
                <p><strong>Organization:</strong></p>
                <p>{info.source_name}</p>
                <p><strong>Description:</strong></p> 
                <p>{info.source_description}</p>
            </div>
        </div>
    );
}
    export default Home;