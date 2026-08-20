export const enum NothingSelected {
  /** Default paste behaviour */
  doNothing,
  /** Automatically select word surrounding the cursor */
  autoSelect,
  /** Insert `[](url)` */
  insertInline,
  /** Insert `<url>` */
  insertBare,

  /** Insert `[title](url)` by fetching title */
  insertTitle,
}

export interface PluginSettings {
  regex: string;
  nothingSelected: NothingSelected;
  listForImgEmbed: string;
}
