import './css/Card.css';

function Card({ nation, population, year }) {
    return (
        <div className="card bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl front-bold mb-2">{year}</h2>
            <p className="text-gray-700">Population: {population.toLocaleString()}</p>
            <p className="text-gray-500">Nation: {nation}</p>
        </div>
    );
}

export default Card;