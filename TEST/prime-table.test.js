"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parsePrime, updateCellText, addColumnText, addRowText } = require("../src/prime-table");

const sample = "|A.[ID]|B.[Resources]|C.[Notes]|\n"
    + "|ID.[1]|RESOURCES.[Copper|Silver]|NOTES.[Keep this text.]|\n"
    + "|ID.[2]|RESOURCES.[Salt]|NOTES.[No terminal pipe.]";

test("parses pipe characters inside Prime cell values", () => {
    const table = parsePrime(sample);
    assert.deepEqual(table.headers, ["ID", "Resources", "Notes"]);
    assert.equal(table.rows[0].cells[1].value, "Copper|Silver");
    assert.equal(table.rows[1].cells[2].value, "No terminal pipe.");
});

test("editing one value preserves every other byte", () => {
    const changed = updateCellText(sample, 0, 1, "Gold|Copper");
    assert.equal(changed, sample.replace("Copper|Silver", "Gold|Copper"));
    assert.equal(parsePrime(changed).rows[0].cells[1].value, "Gold|Copper");
});

test("adds blank rows and columns without replacing recorded values", () => {
    const withColumn = addColumnText(sample, "Weather");
    const withRow = addRowText(withColumn);
    const table = parsePrime(withRow);
    assert.equal(table.headers.length, 4);
    assert.equal(table.rows.length, 3);
    assert.equal(table.rows[2].cells[0].value, "3");
    assert.equal(table.rows[2].cells[1].value, "");
    assert.equal(table.rows[0].cells[1].value, "Copper|Silver");
});

test("starts an empty Prime file with a column", () => {
    assert.equal(addColumnText("", "Name"), "|A.[Name]|\n");
    assert.equal(parsePrime(addRowText(addColumnText("", "Name"))).rows.length, 1);
});

test("opens the current No Man's Sky Prime file", () => {
    const file = path.join(__dirname, "../Spreadsheet/No_Man_Sky.Prime");
    const table = parsePrime(fs.readFileSync(file, "utf8"));
    assert.equal(table.headers.length, 17);
    assert.equal(table.rows.length, 4);
    assert.equal(table.rows[3].cells[3].value, "Guel Prime");
});

test("rejects values that would break the Prime format", () => {
    assert.throws(() => updateCellText(sample, 0, 1, "bad]value"));
    assert.throws(() => addColumnText(sample, "Bad|Name"));
});
