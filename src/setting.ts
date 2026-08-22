import UrlIntoSel_Plugin from "./main";
import { PluginSettingTab, Setting } from "obsidian";
import { PluginSettings, CursorPositionAfterPaste } from "./types";

export { PluginSettings, CursorPositionAfterPaste } from "./types";
export const DEFAULT_SETTINGS: PluginSettings = {
  regex:
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/ .source,
  listForImgEmbed: "",
  imageExtensions: "webp,png,jpg,jpeg,gif,svg,avif,ico,tiff,bmp",
  cursorPositionAfterPaste: CursorPositionAfterPaste.End,
  enableLinkWrapping: false,
  enableTitleFetching: true,
  enableImageEmbed: true,
  enableWikilinks: true,
};

export class UrlIntoSelectionSettingsTab extends PluginSettingTab {
  display() {
    let { containerEl } = this;
    const plugin: UrlIntoSel_Plugin = (this as any).plugin;

    containerEl.empty();
    containerEl.createEl("h2", { text: "URL-into-selection Settings" });

    // Section 1: Features
    containerEl.createEl("h3", { text: "Features" });

    new Setting(containerEl)
      .setName("Link Wrapping")
      .setDesc("Wrap selected text in a markdown link when pasting a URL, or wrap a selected URL with pasted text.")
      .addToggle((toggle) => {
        toggle
          .setValue(plugin.settings.enableLinkWrapping !== false)
          .onChange(async (value) => {
            plugin.settings.enableLinkWrapping = value;
            await plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Fetch Webpage Title")
      .setDesc("Automatically fetch webpage title and insert as [Title](URL) when pasting a URL with no text selected.")
      .addToggle((toggle) => {
        toggle
          .setValue(plugin.settings.enableTitleFetching !== false)
          .onChange(async (value) => {
            plugin.settings.enableTitleFetching = value;
            await plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Image & Media Embeds")
      .setDesc("Automatically format image and video URLs using image embed syntax (e.g. ![](url)).")
      .addToggle((toggle) => {
        toggle
          .setValue(plugin.settings.enableImageEmbed !== false)
          .onChange(async (value) => {
            plugin.settings.enableImageEmbed = value;
            await plugin.saveSettings();
            // Refresh to show/hide sub-settings
            this.display();
          });
      });

    new Setting(containerEl)
      .setName("Wikilink Support")
      .setDesc("Support Obsidian Wikilink alias formatting (e.g., [[Page|Alias]]) when pasting.")
      .addToggle((toggle) => {
        toggle
          .setValue(plugin.settings.enableWikilinks !== false)
          .onChange(async (value) => {
            plugin.settings.enableWikilinks = value;
            await plugin.saveSettings();
          });
      });

    // Section 2: Image & Media Options (shown only if enableImageEmbed is true)
    if (plugin.settings.enableImageEmbed !== false) {
      containerEl.createEl("h3", { text: "Image & Media Options" });

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

    // Section 3: Advanced Configuration
    containerEl.createEl("h3", { text: "Advanced Settings" });

    new Setting(containerEl)
      .setName("Cursor position after paste")
      .setDesc("Choose whether to place the cursor at the start or the end of the pasted link.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption(CursorPositionAfterPaste.End, "End of link")
          .addOption(CursorPositionAfterPaste.Start, "Start of link")
          .setValue(plugin.settings.cursorPositionAfterPaste || CursorPositionAfterPaste.End)
          .onChange(async (value) => {
            plugin.settings.cursorPositionAfterPaste = value as CursorPositionAfterPaste;
            await plugin.saveSettings();
          });
      });

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
                "C:\\Users\\documents\\file.txt",
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
  }
}
