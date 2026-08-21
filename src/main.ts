import { Editor, MarkdownView, Plugin } from "obsidian";
import UrlIntoSelection from "./core";
import {
  PluginSettings,
  UrlIntoSelectionSettingsTab,
  DEFAULT_SETTINGS,
} from "./setting";

export default class UrlIntoSel_Plugin extends Plugin {
  settings: PluginSettings;

  private isShiftDown = false;

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Shift") this.isShiftDown = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") this.isShiftDown = false;
  };

  private handleWindowBlur = () => {
    this.isShiftDown = false;
  };

  // pasteHandler = (cm: CodeMirror.Editor, e: ClipboardEvent) => UrlIntoSelection(cm, e, this.settings);
  pasteHandler = (evt: ClipboardEvent, editor: Editor) => {
    if (this.isShiftDown) return; // Bypass plugin when Shift is held (e.g. Paste as plain text)
    UrlIntoSelection(editor, evt, this.settings);
  };

  async onload() {
    console.log("loading url-into-selection");
    await this.loadSettings();

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleWindowBlur);

    this.addSettingTab(new UrlIntoSelectionSettingsTab(this.app, this));
    this.addCommand({
      id: "paste-url-into-selection",
      name: "",
      editorCallback: async (editor: Editor) => {
        const clipboardText = await navigator.clipboard.readText();
        await UrlIntoSelection(editor, clipboardText, this.settings);
      },
    });

    this.app.workspace.on("editor-paste", this.pasteHandler);
  }

  onunload() {
    console.log("unloading url-into-selection");

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleWindowBlur);

    this.app.workspace.off("editor-paste", this.pasteHandler);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
