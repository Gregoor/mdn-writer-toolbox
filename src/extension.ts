import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
import * as vscode from "vscode";

function getRootPath(filePath: string) {
  const fsRoot = path.parse(process.cwd()).root;
  while (filePath !== fsRoot) {
    filePath = path.dirname(filePath);
    const currentPath = path.join(filePath, "package.json");
    if (fs.existsSync(currentPath)) {
      return path.dirname(currentPath);
    }
  }
  return null;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let panel: vscode.WebviewPanel | null = null;
const rootPathServerPorts = new Map();

function updatePreview(textEditor: vscode.TextEditor) {
  if (!textEditor) {
    return;
  }
  const { fileName } = textEditor.document;
  const rootPath = getRootPath(fileName);
  if (!rootPath) {
    return;
  }

  process.env["CONTENT_ROOT"] = path.join(rootPath, "files");
  const Document = require(path.join(
    rootPath,
    "node_modules",
    "@mdn",
    "yari",
    "content",
    "document.js"
  ));
  const doc = Document.read(fileName);

  if (rootPathServerPorts.has(rootPath)) {
  } else {
  }
  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      "mdn.preview",
      "Loading MDN Preview",
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );
    panel.onDidDispose(() => {
      panel = null;
    });
  }
  const port = randomIntFromInterval(1000, 9999);
  const childProcess = exec("npm run start", {
    cwd: rootPath,
    env: { ...process.env, SERVER_PORT: port.toString() },
  });
  childProcess.stdout?.on("data", (data) => {
    if (data.startsWith("Listening on port")) {
      panel!.title = doc.metadata.title;
      panel!.webview.html = `<meta http-equiv="refresh" content="0;url=http://localhost:${port}${doc.url}" />`;
    }
  });
}

export async function activate(context: vscode.ExtensionContext) {
  const textEditor = vscode.window.activeTextEditor;
  if (textEditor) {
    updatePreview(textEditor);
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      const textEditor = vscode.window.activeTextEditor;
      if (textEditor) {
        updatePreview(textEditor);
      }
    }),
    vscode.window.onDidChangeActiveTextEditor((textEditor) => {
      if (textEditor) {
        updatePreview(textEditor);
      }
    })
  );
}
