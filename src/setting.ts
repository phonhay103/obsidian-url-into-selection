import UrlIntoSel_Plugin from "./main";
import { PluginSettingTab, Setting } from "obsidian";
import { NothingSelected, PluginSettings } from "./types";

export { NothingSelected, PluginSettings } from "./types";

export const DEFAULT_SETTINGS: PluginSettings = {
  regex:
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/ .source,
  nothingSelected: NothingSelected.doNothing,
  listForImgEmbed: "",
  imageExtensions: "webp,png,jpg,jpeg,gif,svg,avif,ico,tiff,bmp",
};

export class UrlIntoSelectionSettingsTab extends PluginSettingTab {
  display() {
    let { containerEl } = this;
    const plugin: UrlIntoSel_Plugin = (this as any).plugin;

    containerEl.empty();
    containerEl.createEl("h2", { text: "URL-into-selection Settings" });

    new Setting(containerEl)
      .setName("Fallback Regular expression")
      .setDesc(
        "Regular expression used to match URLs when default match fails. " +
          "Leave empty to use the built-in URL pattern."
      )
      .addText((text) => {
        text
          .setPlaceholder("Enter regular expression here..")
          .setValue(plugin.settings.regex)
          .onChange(async (value) => {
            if (value.length > 0) {
              try {
                new RegExp(value);
                plugin.settings.regex = value;
                await plugin.saveSettings();
              } catch (error) {
                console.warn("Invalid regex pattern:", error);
                // Keep the old value
              }
            }
          });
        // Add preview functionality
        text.inputEl.addEventListener("keyup", (e) => {
          if (e.key === "Enter" && text.getValue().length > 0) {
            try {
              const regex = new RegExp(text.getValue());
              // Test against common patterns
              const testUrls = [
                "https://example.com",
                "ftp://files.example.com/file.txt",
                "C:\\Users\documents\file.txt",
                "just plain text",
              ];
              const results = testUrls.map(url => ({
                url,
                matches: regex.test(url),
              }));
              // Display preview in a temporary element
              const previewEl = containerEl.createEl("div", { attr: { role: "status" }, text: JSON.stringify(results) });
              setTimeout(() => previewEl.remove(), 3000);
            } catch (error) {
              // Invalid regex - already handled on change
            }
          }
        });
        return text;
      });

    new Setting(containerEl)
      .setName("Image Extensions")
      .setDesc(
        "Comma-separated list of file extensions that will be automatically treated as images."
      )
      .addText((text) => {
        text
          .setPlaceholder("e.g. webp, png, jpg, jpeg")
          .setValue(plugin.settings.imageExtensions)
          .onChange(async (value) => {
            if (value.length > 0) {
              plugin.settings.imageExtensions = value;
              await plugin.saveSettings();
            }
          });
      });

    new Setting(containerEl)
      .setName("Behavior on pasting URL when nothing is selected")
      .setDesc("Configure what happens when you paste a URL with no text selected.")
      .addDropdown((dropdown) => {
        const options: Record<NothingSelected, string> = {
          0: "Do nothing",
          4: "Smart insert",
        };

        dropdown
          .addOptions(options)
          .setValue(plugin.settings.nothingSelected.toString())
          .onChange(async (value) => {
            plugin.settings.nothingSelected = +value;
            await plugin.saveSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName("Whitelist for image embed syntax")
      .setDesc(
        createFragment((el) => {
          el.appendText(
            "![selection](url) will be used for URL that matches the following list."
          );
          el.createEl("br");
          el.appendText("Rules are regex-based, split by line break.");
        })
      )
      .addTextArea((text) => {
        text
          .setPlaceholder("Example:\nyoutu.?be|vimeo")
          .setValue(plugin.settings.listForImgEmbed)
          .onChange((value) => {
            plugin.settings.listForImgEmbed = value;
            plugin.saveData(plugin.settings);
            return text;
          });
        text.inputEl.rows = 6;
        text.inputEl.cols = 25;
      });
  }
}