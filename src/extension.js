"use strict";

const vscode = require("vscode");
const { randomBytes } = require("node:crypto");
const { parsePrime, updateCellText, addColumnText, addRowText } = require("./prime-table");

const VIEW_TYPE = "devforge.primeSpreadsheet";

function activate(context) {
    context.subscriptions.push(vscode.window.registerCustomEditorProvider(VIEW_TYPE, {
        async resolveCustomTextEditor(document, panel) {
            panel.webview.options = {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")],
            };
            panel.webview.html = htmlFor(panel.webview, context.extensionUri);

            const refresh = () => {
                try {
                    const table = parsePrime(document.getText());
                    panel.webview.postMessage({
                        type: "state",
                        version: document.version,
                        headers: table.headers,
                        rows: table.rows.map((row) => row.cells.map((cell) => cell.value)),
                        error: null,
                    });
                } catch (error) {
                    panel.webview.postMessage({
                        type: "state", version: document.version, headers: [], rows: [], error: error.message,
                    });
                }
            };

            const changes = vscode.workspace.onDidChangeTextDocument((event) => {
                if (event.document.uri.toString() === document.uri.toString()) refresh();
            });
            panel.onDidDispose(() => changes.dispose());

            panel.webview.onDidReceiveMessage(async (message) => {
                if (message.type === "ready") { refresh(); return; }
                if (message.type === "openText") {
                    await vscode.commands.executeCommand("vscode.openWith", document.uri, "default");
                    return;
                }
                try {
                    if (message.version !== document.version) {
                        throw new Error("The file changed in another editor. Review the refreshed grid and try again.");
                    }
                    const before = document.getText();
                    let edit = new vscode.WorkspaceEdit();
                    if (message.type === "editCell") {
                        const table = parsePrime(before);
                        const cell = table.rows[message.row]?.cells[message.column];
                        if (!cell || cell.value !== message.previousValue) {
                            throw new Error("The cell changed before this edit was applied.");
                        }
                        // Validate the proposed value before changing the document.
                        updateCellText(before, message.row, message.column, message.value);
                        edit.replace(document.uri,
                            new vscode.Range(document.positionAt(cell.valueStart), document.positionAt(cell.valueEnd)),
                            message.value);
                    } else if (message.type === "addRow") {
                        edit.replace(document.uri, new vscode.Range(document.positionAt(0), document.positionAt(before.length)), addRowText(before));
                    } else if (message.type === "addColumn") {
                        const label = await vscode.window.showInputBox({ prompt: "New Prime spreadsheet column", validateInput: (value) => value.trim() ? null : "Enter a column name" });
                        if (label === undefined) return;
                        if (message.version !== document.version) throw new Error("The file changed. Try adding the column again.");
                        edit.replace(document.uri, new vscode.Range(document.positionAt(0), document.positionAt(before.length)), addColumnText(before, label));
                    } else {
                        return;
                    }
                    if (!await vscode.workspace.applyEdit(edit)) throw new Error("VS Code could not apply the edit");
                } catch (error) {
                    panel.webview.postMessage({ type: "error", message: error.message });
                    refresh();
                }
            });
        },
    }, { webviewOptions: { retainContextWhenHidden: true } }));
}

function htmlFor(webview, extensionUri) {
    const nonce = randomBytes(16).toString("hex");
    const css = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "prime-grid.css"));
    const script = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "prime-grid.js"));
    return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<link rel="stylesheet" href="${css}"><title>Prime Spreadsheet</title></head>
<body><header><strong>Prime Spreadsheet</strong><span id="summary"></span><input id="search" type="search" placeholder="Filter rows…" aria-label="Filter rows"><button id="add-row">Add row</button><button id="add-column">Add column</button><button id="open-text">Open text</button></header>
<main><div id="notice" role="status"></div><div id="grid-wrap"><table id="grid"></table></div></main>
<footer>Click a cell to edit. Press Enter or leave the cell to apply. Use Ctrl+S to save.</footer>
<script nonce="${nonce}" src="${script}"></script></body></html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };
