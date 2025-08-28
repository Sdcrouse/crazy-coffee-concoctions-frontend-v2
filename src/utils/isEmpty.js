export default function isEmpty(value) {     
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'string') return value.trim().length === 0;
    if (typeof value === 'object' && value.constructor === Object) return Object.keys(value).length === 0;

    throw new TypeError('The isEmpty() function only accepts values that are null, undefined, arrays, strings, or objects.');
};

export function allEmpty(...values) {
    for (const value of values) {
        if (!isEmpty(value)) return false;
    }
    return true;
};