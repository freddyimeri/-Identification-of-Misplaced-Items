require('jsdom-global')();
const { expect } = require('chai');
global.expect = expect;

// Mock localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

global.localStorage = new LocalStorageMock();

// Suppress warnings and errors
const originalWarn = console.warn;
const originalError = console.error;

const suppressedWarnings = [
    'ReactDOM.render is no longer supported in React 18',
    '`ReactDOMTestUtils.act` is deprecated in favor of `React.act`',
    'Support for defaultProps will be removed from function components in a future major release',
    'unmountComponentAtNode is deprecated and will be removed in the next major release'
];

console.warn = (...args) => {
    if (suppressedWarnings.some(warning => args[0] && args[0].includes(warning))) {
        return;
    }
    originalWarn(...args);
};

console.error = (...args) => {
    if (suppressedWarnings.some(warning => args[0] && args[0].includes(warning))) {
        return;
    }
    originalError(...args);
};
