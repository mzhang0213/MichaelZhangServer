// ts-object-builder.js
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Simple parser for TypeScript interface string
function parseTypeFromString(typeString) {
    // Remove interface keyword and clean up
    let cleanType = typeString.replace(/interface\s+\w+\s*{/, '').replace(/}$/, '').trim();

    const lines = cleanType.split('\n').map(line => line.trim()).filter(line => line);
    const schema = {};

    for (const line of lines) {
        // Parse line like: "id: string," or "title: string"
        const match = line.match(/^(\w+)(\?)?\s*:\s*([^;]+)[,;]?$/);
        if (match) {
            const [, fieldName, optional, fieldType] = match;
            schema[fieldName] = {
                type: fieldType.trim().replace(/\[\]$/, ''), // Remove [] for arrays
                required: !optional,
                isArray: fieldType.includes('[]')
            };
        }
        // Handle nested objects like link: { title: string, link: string }
        else if (line.includes(': {')) {
            const fieldName = line.split(':')[0].trim();
            schema[fieldName] = { type: 'object', required: true };
        }
    }

    return schema;
}

async function buildObjectFromSchema(schema, obj = {}) {
    for (const [key, field] of Object.entries(schema)) {
        if (field.type === 'object') {
            // For nested objects, ask for JSON input
            console.log(`\nNested object '${key}': Enter as JSON object (e.g., {"title": "text", "link": "url"})`);
            const answer = await askQuestion(`Enter ${key}${field.required ? ' (required)' : ''}: `);
            try {
                obj[key] = answer ? JSON.parse(answer) : {};
            } catch (e) {
                console.log("Invalid JSON format, setting empty object");
                obj[key] = {};
            }
        } else if (field.isArray) {
            console.log(`\nArray field '${key}': Enter as JSON array (e.g., ["item1", "item2"])`);
            const answer = await askQuestion(`Enter ${key}${field.required ? ' (required)' : ''}: `);
            try {
                obj[key] = answer ? JSON.parse(answer) : [];
            } catch (e) {
                console.log("Invalid JSON format, setting empty array");
                obj[key] = [];
            }
        } else {
            const requiredText = field.required ? ' (required)' : ' (optional)';
            const answer = await askQuestion(`Enter ${key}${requiredText}: `);

            if (answer || field.required) {
                obj[key] = answer || '';
            }
        }
    }

    return obj;
}


// Function to convert object to JavaScript format (no quotes on keys)
function toJSObject(obj, indent = 0) {
    const spaces = '  '.repeat(indent);

    if (obj === null) return 'null';
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        const items = obj.map(item => toJSObject(item, indent + 1));
        return `[\n${items.map(item => '  ' + spaces + item).join(',\n')}\n${spaces}]`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';

        const items = keys.map(key => {
            const value = toJSObject(obj[key], indent + 1);
            return `${key}: ${value}`;
        });

        return `{\n${items.map(item => '  ' + spaces + item).join(',\n')}\n${spaces}}`;
    }

    if (typeof obj === 'string') {
        return `"${obj}"`;
    }

    return String(obj);
}

async function main(items) {
    console.log("TypeScript Object Builder");
    console.log("========================");

    const typeString = `
{
    id: string,
    title: string,
    description: string,
    detailsDefault?: string,
    icon:string,
    technology: TechnologyEntryType[],
    link:{
        title:string,
        link:string
    }
}
`;

    console.log("Parsing type:");
    console.log(typeString);

    try {
        const schema = parseTypeFromString(typeString);
        const result = await buildObjectFromSchema(schema);

        items.push(result);
        const final = {res:items}

        console.log("\nGenerated Object:");
        console.log(toJSObject(final));

        const more = await askQuestion("add more? if yes then type y\n");
        if (more==="y"){
            await main(items)
        }else{
            const filename = `result-${Date.now()}.js`;
            const fileContent = `module.exports = ${toJSObject(final)};`;
            fs.writeFileSync(filename, fileContent);
            console.log(`\nResult saved to: ${filename}`);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }

    rl.close();
}

main([]).catch(console.error);