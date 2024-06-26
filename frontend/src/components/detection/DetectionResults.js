// src/components/detection/DetectionResults.js
import React from 'react';
import '../../styles/main.css';

const DetectionResults = ({ result }) => {
    return (
        result && (
            <div className="mt-5">
                <h2>Detection Results</h2>
                {result.error ? (
                    <p className="text-danger">{result.error}</p>
                ) : (
                    <>
                        {result.output_video_url && (
                            <video controls src={result.output_video_url} className="img-fluid"></video>
                        )}
                        {result.output_image_url && (
                            <img src={result.output_image_url} alt="Detected Objects" className="img-fluid" />
                        )}
                        <h3 className="mt-4">Misplaced Objects</h3>
                        <ul className="list-group">
                            {result.misplaced_objects.flat().map((obj, index) => (
                                <li key={index} className="list-group-item">
                                    {obj.class_name} is misplaced. Allowed locations: {(obj.allowed_locations || []).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )
    );
};

export default DetectionResults;
