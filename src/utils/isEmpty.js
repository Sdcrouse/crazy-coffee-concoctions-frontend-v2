export default function isEmpty(value) {
    // Note: This does not check for empty objects; this can be changed later if need be.
     
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'string') return value.trim().length === 0;
    if (!value && value !== 0) return true;

    throw new TypeError('The isEmpty() function only accepts arrays and strings');
};