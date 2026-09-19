"use strict";

const vscode = acquireVsCodeApi();
const grid = document.getElementById("grid");
const notice = document.getElementById("notice");
const search = document.getElementById("search");
const summary = document.getElementById("summary");
let state = { version: 0, headers: [], rows: [] };

function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.classList.toggle("error", isError);
}

function render() {
    grid.replaceChildren();
    if (state.error) {
        showNotice(state.error + " Open as text to repair the file.", true);
        summary.textContent = "";
        return;
    }
    const term = search.value.trim().toLocaleLowerCase();
    const visible = state.rows.map((cells, index) => ({ cells, index }))
        .filter((row) => !term || row.cells.some((value) => value.toLocaleLowerCase().includes(term)));
    summary.textContent = `${visible.length} of ${state.rows.length} rows · ${state.headers.length} columns`;
    if (!state.headers.length) {
        showNotice("This Prime file is empty. Add a column to start your spreadsheet.");
        return;
    }
    showNotice(visible.length ? "" : "No rows match the filter.");
    const thead = grid.createTHead();
    const headerRow = thead.insertRow();
    const numberHead = document.createElement("th");
    numberHead.textContent = "#";
    headerRow.append(numberHead);
    for (const label of state.headers) {
        const th = document.createElement("th");
        th.textContent = label;
        th.title = label;
        headerRow.append(th);
    }
    const tbody = grid.createTBody();
    for (const row of visible) {
        const tr = tbody.insertRow();
        const number = tr.insertCell();
        number.className = "row-number";
        number.textContent = String(row.index + 1);
        for (let column = 0; column < state.headers.length; column += 1) {
            const td = tr.insertCell();
            const input = document.createElement("input");
            input.type = "text";
            input.value = row.cells[column] || "";
            input.title = input.value;
            input.setAttribute("aria-label", `${state.headers[column]}, row ${row.index + 1}`);
            let original = input.value;
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") input.blur();
                if (event.key === "Escape") { input.value = original; input.blur(); }
            });
            input.addEventListener("blur", () => {
                if (input.value === original) return;
                const previousValue = original;
                original = input.value;
                vscode.postMessage({ type: "editCell", version: state.version, row: row.index, column, previousValue, value: input.value });
            });
            td.append(input);
        }
    }
}

window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.type === "state") {
        state = message;
        render();
    } else if (message.type === "error") {
        showNotice(message.message, true);
    }
});

search.addEventListener("input", render);
document.getElementById("add-row").addEventListener("click", () => vscode.postMessage({ type: "addRow", version: state.version }));
document.getElementById("add-column").addEventListener("click", () => vscode.postMessage({ type: "addColumn", version: state.version }));
document.getElementById("open-text").addEventListener("click", () => vscode.postMessage({ type: "openText" }));
vscode.postMessage({ type: "ready" });
