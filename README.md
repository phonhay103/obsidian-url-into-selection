# Paste URL into selection

Insert links (URLs) into a selected text "notion-style" using regular `Ctrl/Cmd + V`

Also works the other way around, inserts text into a selected link (URL) by command palette/hotkey(need to be set manually)

## Demo

![example](https://user-images.githubusercontent.com/4748206/98997874-ed55fb80-253d-11eb-9121-709a316a4d1e.gif)

## Compatibility

Custom plugins are only available for Obsidian v0.9.8+.

## Settings

- **Image Extensions**: Provide a comma-separated list of image extensions (e.g. `webp,png,jpg,jpeg,gif`). When pasting a matching image URL, it will be automatically inserted as an image embed (`![](url)`).
- **When nothing is selected**: The plugin will automatically format the pasted URL:
  - If pasting a normal URL, it will fetch the webpage title and automatically insert a Markdown link (`[title](url)`).
  - If the URL is an image (based on defined image extensions), it will format it as an image embed (`![](url)`).

## Paste as Plain Text

If you want to paste a URL as plain text without triggering the plugin's formatting, simply use Obsidian's default **Paste as plain text** shortcut (`Ctrl/Cmd + Shift + V`). The plugin detects the `Shift` key and will bypass formatting automatically.

# Installation

In order to install this plugin, go to "Settings > Third Party Plugins > Paste URL into selection".

If you have any kind of feedback or questions, feel free to reach out via GitHub issues or `@evrwhr` on [Obsidian Discord server](https://discord.com/invite/veuWUTm).

---

> If you like what I do, you could consider buying me a coffee. It is unnecessary, but appreciated :) https://www.buymeacoffee.com/evrwhr
