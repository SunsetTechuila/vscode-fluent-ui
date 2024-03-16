import path from "node:path";
import fs from "node:fs/promises";

import vscode from "vscode";

import { messages } from "./messages";
import { CONTAINER } from ".";

/**
 * Deletes backup files matching UUID
 */
export async function deleteBackupFiles(htmlFile: string, jsFile: string) {
  try {
    await fs.unlink(htmlFile);
    console.log("Successfully removed backup file");
    await fs.unlink(jsFile);
    console.log("Successfully removed js file");
  } catch (error) {
    vscode.window.showErrorMessage(error);
  }
}

/**
 * Creates a backup file from the current workspace.html
 */
export async function createBackup(base: string, htmlFile: string) {
  try {
    const html = await fs.readFile(htmlFile, "utf-8");

    await fs.writeFile(buildBackupFilePath(base), html, "utf-8");
  } catch (e) {
    vscode.window.showInformationMessage(messages.admin);
    throw e;
  }
}

export async function getBackupUuid(htmlFilePath: string) {
  try {
    const htmlContent = await fs.readFile(htmlFilePath, "utf-8");

    const match = htmlContent.match(/fui/);

    if (!match) {
      return null;
    } else {
      return match[0];
    }
  } catch (e) {
    vscode.window.showInformationMessage(`${messages.genericError}${e}`);
  }
}

/**
 * Restores the backed up workbench.html file
 */
export async function restoreBackup(backupFilePath: string, htmlFile: string) {
  try {
    const stat = await fs.stat(backupFilePath);
    if (stat.isFile()) {
      await fs.unlink(htmlFile);
      await fs.copyFile(backupFilePath, htmlFile);
    }
  } catch (e) {
    vscode.window.showInformationMessage(messages.admin);
    throw e;
  }
}

/**
 * Generates the path for the backup file we're creating
 */
export const buildBackupFilePath = (base: string) =>
  path.join(base, CONTAINER, "workbench", `workbench.fui`);
