
export const enum CursorPositionAfterPaste {
  End = "end",
  Start = "start",
}

export interface PluginSettings {
  regex: string;
  listForImgEmbed: string;
  imageExtensions: string;
  customRegex: string | null;
  cursorPositionAfterPaste: CursorPositionAfterPaste;
  enableLinkWrapping: boolean;
  enableTitleFetching: boolean;
  enableImageEmbed: boolean;
  enableWikilinks: boolean;
}
