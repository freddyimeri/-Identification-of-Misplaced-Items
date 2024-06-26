/* src/components/Rules/GetRules.js */

import React, { useEffect, useState } from 'react';
import { getRules, deleteRule } from '../../services/ruleApi';
import '../../styles/main.css';
import '../../styles/dashboard.css';

const GetRules = ({ onEditRule, onDeleteRule, refresh }) => {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        const fetchRules = async () => {
            const data = await getRules();
            setRules(data);
        };

        fetchRules();
    }, [refresh]);

    const handleDelete = async (ruleId) => {
        await deleteRule(ruleId);
        onDeleteRule(ruleId);
    };

    return (
        <div className="dashboard-card">
            <div className="card card-wide">
                <div className="card-body">
                    <h2 className="card-title">Rules List</h2>
                    <ul className="list-group">
                        <li className="list-group-header">
                            <span>Items</span>
                            <span>Locations</span>
                            <span>Actions</span>
                        </li>
                        {rules.map(rule => (
                            <li key={rule.id} className="list-group-item">
                                <span className="item-label">{rule.item.name}</span>
                                <span className="location-label">{rule.locations.map(location => location.name).join(', ')}</span>
                                <div className="button-group">
                                    <button className="btn btn-secondary" onClick={() => onEditRule(rule)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(rule.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GetRules;
