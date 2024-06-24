// src/pages/Results/DisplayResultsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getImageResults } from '../../services/processMisplacedManagerApi';
import '../../styles/main.css';

const DisplayResultsPage = () => {
    const { imageId } = useParams();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            const data = await getImageResults(imageId);
            setResults(data);
        };
        fetchResults();
    }, [imageId]);

    if (!results) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pages-container-center">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center">Detection Results</h1>
                    <img src={results.output_image_url} alt="Detected Objects" className="img-fluid" />
                    <h2 className="mt-4">Misplaced Objects</h2>
                    <ul className="list-group">
                        {results.misplaced_objects.map(obj => (
                            <li key={obj.class_name} className="list-group-item">
                                {obj.class_name} is misplaced. Allowed locations: {obj.allowed_locations.join(", ")}
                            </li>
                        ))}
                    </ul>
                    <div className="text-center mt-4">
                        <a href="/detection-options" className="btn btn-link">
                            Try another detection
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayResultsPage;
