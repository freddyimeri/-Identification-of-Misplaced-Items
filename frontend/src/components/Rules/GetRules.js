import React, { useEffect, useState } from 'react';
import { getRules, deleteRule } from '../../services/ruleApi';
import '../../styles/main.css';

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
        <div className="rules-list">
            <h2>Rules List</h2>
            <ul className="list-group">
                {rules.map(rule => (
                    <li key={rule.id} className="list-group-item">
                        <span>{rule.item.name} - {rule.locations.map(location => location.name).join(', ')}</span>
                        <div>
                            <button className="btn btn-secondary" onClick={() => onEditRule(rule)}>Edit</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(rule.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetRules;
