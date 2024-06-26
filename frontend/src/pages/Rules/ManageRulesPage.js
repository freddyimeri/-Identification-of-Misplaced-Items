// src/pages/Rules/ManageRulesPage.js

import React, { useState } from 'react';
import AddRule from '../../components/Rules/AddRule';
import GetRules from '../../components/Rules/GetRules';
import UpdateRule from '../../components/Rules/UpdateRule';
import '../../styles/main.css';
import '../../styles/dashboard.css';

const ManageRulesPage = () => {
    const [editingRule, setEditingRule] = useState(null);
    const [refreshRules, setRefreshRules] = useState(false);

    const handleRuleAdded = () => {
        setRefreshRules(!refreshRules);
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
    };

    const handleUpdateCompleted = () => {
        setEditingRule(null);
        setRefreshRules(!refreshRules);
    };

    const handleDeleteRule = () => {
        setRefreshRules(!refreshRules);
    };

    return (
        <div className="pages-container-center">
            <h1 className="dashboard-title">Manage Rules</h1>
            <div className="dashboard-card">
                <AddRule onRuleAdded={handleRuleAdded} />
                {editingRule && (
                    <UpdateRule rule={editingRule} onUpdateCompleted={handleUpdateCompleted} />
                )}
                <GetRules onEditRule={handleEditRule} onDeleteRule={handleDeleteRule} refresh={refreshRules} />
            </div>
        </div>
    );
};

export default ManageRulesPage;
