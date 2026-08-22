export const enum NothingSelected {
  /** Default paste behaviour */ doNothing = 0,
  /** Insert `[title](url)` by fetching title */ insertTitle = 4,
}

export interface PluginSettings {
  regex: string;
  nothingSelected: NothingSelected;
  listForImgEmbed: string;
  imageExtensions: string;
  customRegex: string | null;
}