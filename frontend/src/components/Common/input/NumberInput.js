import React, { useState, useEffect } from 'react';
import '../../../styles/input/NumberInput.css';

const NumberInput = ({ value, min, max, step, onValueChange, disabled }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value); // Update local value when prop changes
    }, [value]);

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            if (newValue < min) {
                setLocalValue(min);
                onValueChange(min);
            } else if (newValue > max) {
                setLocalValue(max);
                onValueChange(max);
            } else {
                setLocalValue(newValue);
                onValueChange(newValue);
            }
        } else {
            setLocalValue(min);
            onValueChange(min);
        }
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        const newValue = localValue + step;
        if (newValue <= max) {
            setLocalValue(newValue);
            onValueChange(newValue);
        }
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        const newValue = localValue - step;
        if (newValue >= min) {
            setLocalValue(newValue);
            onValueChange(newValue);
        }
    };

    return (
        <div className="number-input-container">
            <div className="number-input-wrapper">
                <input
                    type="number"
                    className="number-input-field"
                    value={localValue}
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                />
                <div className="number-input-controls">
                    <button className="number-input-button up" onClick={handleIncrement} disabled={disabled}>
                        &#9650;
                    </button>
                    <button className="number-input-button down" onClick={handleDecrement} disabled={disabled}>
                        &#9660;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberInput;
