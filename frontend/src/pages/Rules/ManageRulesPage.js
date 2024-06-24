import React, { useState } from 'react';
import AddRule from '../../components/Rules/AddRule';
import GetRules from '../../components/Rules/GetRules';
import UpdateRule from '../../components/Rules/UpdateRule';
import '../../styles/main.css';

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
        <div className="manage-rules-page">
            <h1>Manage Rules</h1>
            <AddRule onRuleAdded={handleRuleAdded} />
            {editingRule && (
                <UpdateRule rule={editingRule} onUpdateCompleted={handleUpdateCompleted} />
            )}
            <GetRules onEditRule={handleEditRule} onDeleteRule={handleDeleteRule} refresh={refreshRules} />
        </div>
    );
};

export default ManageRulesPage;
