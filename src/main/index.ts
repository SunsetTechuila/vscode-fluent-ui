import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import vscode from "vscode";

import {
  buildBackupFilePath,
  createBackup,
  deleteBackupFiles,
  getBackupUuid,
  restoreBackup,
} from "./backup-helper";
import { messages } from "./messages";

export const CONTAINER = "electron-sandbox";

function enabledRestart() {
  vscode.window
    .showInformationMessage(messages.enabled, { title: messages.restartIde })
    .then(reloadWindow);
}

function restart() {
  vscode.window
    .showInformationMessage(messages.disabled, { title: messages.restartIde })
    .then(reloadWindow);
}

function reloadWindow() {
  vscode.commands.executeCommand("workbench.action.reloadWindow");
}

/**
 * Removes injected files from workbench.html file
 */
function clearHTML(html: string) {
  html = html.replace(/<!-- FUI-CSS-START -->[\s\S]*?<!-- FUI-CSS-END -->\n*/, "");
  html = html.replace(/<!-- FUI-ID -->\n*/g, "");

  return html;
}

async function buildCSSTag(fileRelativePath: string) {
  try {
    const fileAbsolutePath = path.join(__dirname, fileRelativePath);
    const stylesContent = await fs.readFile(fileAbsolutePath, "utf-8");

    return `<style>${stylesContent}</style>\n`;
  } catch (error) {
    vscode.window.showErrorMessage(error);
    vscode.window.showWarningMessage(messages.cannotLoad + fileRelativePath);
  }
}

export async function getBase64Image(wallPath: string) {
  try {
    if (wallPath) {
      const blurredImage = await sharp(wallPath).blur(100).toBuffer();

      return `data:image/png;base64,${blurredImage.toString("base64")}`;
    }

    return false;
  } catch (e) {
    vscode.window.showInformationMessage(messages.admin);
    throw e;
  }
}

async function getCSSTag() {
  const config = vscode.workspace.getConfiguration("fluent-ui-vscode");

  const enableBg = config.get("enableWallpaper") as boolean;
  const bgURL = config.get("wallpaperPath") as string;

  const accent = `${config.get("accent")}`;
  const darkBgColor = `${config.get("darkBackground")}b3`;
  const lightBgColor = `${config.get("lightBackground")}b3`;

  let encodedImage: boolean | string = false;

  if (enableBg) {
    encodedImage = await getBase64Image(bgURL);
  }

  const stylesPath = "dist/styles.css";

  let cssTagContent = await buildCSSTag(stylesPath);

  if (cssTagContent) {
    cssTagContent = cssTagContent.replace("CARD_DARK_BG_COLOR", darkBgColor);
    cssTagContent = cssTagContent.replace("CARD_LIGHT_BG_COLOR", lightBgColor);
    cssTagContent = cssTagContent.replace("ACCENT_COLOR", accent);

    if (!enableBg) {
      cssTagContent = cssTagContent.replace("APP_BG", "transparent");
    } else {
      cssTagContent = cssTagContent.replace("APP_BG", "var(--card-bg)");
    }

    if (encodedImage) {
      cssTagContent = cssTagContent.replace("dummy", encodedImage);
    }
  }

  return cssTagContent;
}

async function buildJsFile(jsFile: string) {
  try {
    const fuiScriptRelativePath = "./fui.js";
    const config = vscode.workspace.getConfiguration("fluent-ui-vscode");
    const fuiScript = await fs.readFile(__dirname + fuiScriptRelativePath);
    let buffer = fuiScript.toString();

    const isCompact = config.get("compact");
    const accent = `${config.get("accent")}`;
    const darkBgColor = `${config.get("darkBackground")}b3`;
    const lightBgColor = `${config.get("lightBackground")}b3`;

    buffer = buffer.replace(/\[IS_COMPACT\]/g, String(isCompact));
    buffer = buffer.replace(/\[LIGHT_BG\]/g, `"${lightBgColor}"`);
    buffer = buffer.replace(/\[DARK_BG\]/g, `"${darkBgColor}"`);
    buffer = buffer.replace(/\[ACCENT\]/g, `"${accent}"`);

    await fs.writeFile(jsFile, buffer, "utf-8");

    return;
  } catch (error) {
    vscode.window.showErrorMessage(error);
  }
}

/**
 * Loads the CSS and JS file's contents to be injected into the main HTML document
 */
interface PatchArgs {
  htmlFile: string;
  jsFile: string;
  bypassMessage?: boolean;
}
async function patch({ htmlFile, jsFile, bypassMessage }: PatchArgs) {
  let html = await fs.readFile(htmlFile, "utf-8");
  html = clearHTML(html);

  const styleTags = await getCSSTag();
  // Inject style tag into <head>
  html = html.replace(/(<\/head>)/, "\n" + styleTags + "\n</head>");

  await buildJsFile(jsFile);
  // Injext JS tag into <body>
  html = html.replace(/(<\/html>)/, "\n" + '<script src="fui.js"></script>' + "\n</html>");

  try {
    await fs.writeFile(htmlFile, html, "utf-8");

    if (bypassMessage) {
      reloadWindow();
    } else {
      enabledRestart();
    }
  } catch {
    vscode.window.showInformationMessage(messages.admin);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const appDir = path.dirname(require!.main!.filename);

  const base = path.join(appDir, "vs", "code");
  const htmlFile = path.join(base, CONTAINER, "workbench", "workbench.html");
  const htmlBakFile = path.join(base, CONTAINER, "workbench", "workbench.fui");
  const jsFile = path.join(base, CONTAINER, "workbench", "fui.js");

  /**
   * Installs full version
   */
  async function install(bypassMessage?: boolean) {
    if (!bypassMessage) {
      const backupUuid = await getBackupUuid(htmlFile);
      if (backupUuid) {
        vscode.window.showInformationMessage(messages.alreadySet);
        return;
      }
    }

    await createBackup(base, htmlFile);
    await patch({ htmlFile, jsFile, bypassMessage });
  }

  async function uninstall() {
    await clearPatch();
    restart();
  }

  async function clearPatch() {
    try {
      const backupPath = buildBackupFilePath(base);
      await restoreBackup(backupPath, htmlFile);
      await deleteBackupFiles(htmlBakFile, jsFile);
    } catch (error) {
      vscode.window.showErrorMessage(error);
    }
  }

  const installFUI = vscode.commands.registerCommand("fluent-ui-vscode.enableEffects", install);
  const reloadFUI = vscode.commands.registerCommand("fluent-ui-vscode.reloadEffects", async () => {
    await clearPatch();
    install(true);
  });
  const uninstallFUI = vscode.commands.registerCommand(
    "fluent-ui-vscode.disableEffects",
    uninstall,
  );

  context.subscriptions.push(installFUI);
  context.subscriptions.push(reloadFUI);
  context.subscriptions.push(uninstallFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {}
