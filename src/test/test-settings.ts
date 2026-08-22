import { PluginSettings, CursorPositionAfterPaste } from "../types";

export const DEFAULT_SETTINGS: PluginSettings = {
  regex:
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
      .source,
  listForImgEmbed: "",
  imageExtensions: "webp,png,jpg,jpeg,gif,svg,avif,ico,tiff",
  cursorPositionAfterPaste: CursorPositionAfterPaste.End,
  enableLinkWrapping: false,
  enableTitleFetching: true,
  enableImageEmbed: true,
  enableWikilinks: true,
};

export const TEST_SETTINGS: PluginSettings = {
  ...DEFAULT_SETTINGS,
  enableLinkWrapping: true,
};
