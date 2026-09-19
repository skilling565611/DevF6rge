"use strict";

function linesWithOffsets(text) {
    const result = [];
    let offset = 0;
    for (const raw of text.split("\n")) {
        const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
        result.push({ text: line, start: offset, end: offset + line.length });
        offset += raw.length + 1;
    }
    return result;
}

function cellsInLine(line) {
    const cells = [];
    let depth = 0;
    let start = line.text.startsWith("|") ? 1 : 0;
    for (let i = start; i <= line.text.length; i += 1) {
        const char = line.text[i];
        if (i === line.text.length || (char === "|" && depth === 0)) {
            if (i > start) {
                const raw = line.text.slice(start, i);
                const marker = raw.indexOf(".[");
                if (marker < 1 || !raw.endsWith("]")) {
                    throw new Error(`Invalid Prime cell: ${raw.slice(0, 60)}`);
                }
                cells.push({
                    prefix: raw.slice(0, marker),
                    value: raw.slice(marker + 2, -1),
                    valueStart: line.start + start + marker + 2,
                    valueEnd: line.start + i - 1,
                });
            }
            start = i + 1;
            continue;
        }
        if (char === "[") depth += 1;
        if (char === "]") depth -= 1;
        if (depth < 0) throw new Error("Unbalanced closing bracket in Prime row");
    }
    if (depth !== 0) throw new Error("Unbalanced opening bracket in Prime row");
    return cells;
}

function parsePrime(text) {
    const nonempty = linesWithOffsets(text).filter((line) => line.text.trim());
    if (!nonempty.length) return { headers: [], rows: [], lines: [] };
    const parsed = nonempty.map((line) => ({ ...line, cells: cellsInLine(line) }));
    const headers = parsed[0].cells.map((cell) => cell.value);
    if (!headers.length) throw new Error("Prime table needs a header row");
    for (const [index, row] of parsed.entries()) {
        if (row.cells.length !== headers.length) {
            throw new Error(`Row ${index + 1} has ${row.cells.length} cells; expected ${headers.length}`);
        }
    }
    return { headers, rows: parsed.slice(1), lines: parsed };
}

function validateValue(value) {
    if (typeof value !== "string" || /[\r\n\[\]]/.test(value)) {
        throw new Error("Cell values cannot contain newlines or square brackets");
    }
}

function updateCellText(text, rowIndex, columnIndex, value) {
    validateValue(value);
    const table = parsePrime(text);
    const cell = table.rows[rowIndex]?.cells[columnIndex];
    if (!cell) throw new Error("Cell no longer exists; refresh the grid");
    return text.slice(0, cell.valueStart) + value + text.slice(cell.valueEnd);
}

function nextColumnName(name) {
    let number = 0;
    for (const char of name.toUpperCase()) {
        if (char < "A" || char > "Z") throw new Error("Invalid header column letter");
        number = number * 26 + char.charCodeAt(0) - 64;
    }
    number += 1;
    let result = "";
    while (number) {
        number -= 1;
        result = String.fromCharCode(65 + (number % 26)) + result;
        number = Math.floor(number / 26);
    }
    return result;
}

function addColumnText(text, label) {
    validateValue(label);
    label = label.trim();
    if (!label || label.includes("|")) throw new Error("Enter a column name without a pipe");
    const table = parsePrime(text);
    if (!table.headers.length) return `|A.[${label}]|\n`;
    if (table.headers.some((existing) => existing.toLowerCase() === label.toLowerCase())) {
        throw new Error("That column already exists");
    }
    const headerPrefix = nextColumnName(table.lines[0].cells.at(-1).prefix);
    const dataPrefix = label.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "FIELD";
    const inserts = table.lines.map((line, index) => ({
        at: line.end,
        text: `${line.text.endsWith("|") ? "" : "|"}${index ? dataPrefix : headerPrefix}.[${index ? "" : label}]|`,
    }));
    for (const insert of inserts.reverse()) {
        text = text.slice(0, insert.at) + insert.text + text.slice(insert.at);
    }
    return text;
}

function addRowText(text) {
    const table = parsePrime(text);
    if (!table.headers.length) throw new Error("Add a column before adding rows");
    const first = table.rows[0]?.cells[0];
    const numericIds = table.rows.map((row) => Number(row.cells[0].value)).filter(Number.isInteger);
    const nextId = first?.prefix.toUpperCase() === "ID" ? String(Math.max(0, ...numericIds) + 1) : "";
    const fields = table.headers.map((name, index) => {
        const prefix = table.rows.at(-1)?.cells[index].prefix
            || name.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "FIELD";
        return `${prefix}.[${index === 0 ? nextId : ""}]`;
    });
    const newline = text.includes("\r\n") ? "\r\n" : "\n";
    return text + (text.endsWith("\n") ? "" : newline) + `|${fields.join("|")}|` + newline;
}

module.exports = { parsePrime, updateCellText, addColumnText, addRowText };
