import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  decodeHtmlEntities,
  extractTitle,
  fetchTitle,
} from "./title";
import { setRequestUrlMock } from "../test/obsidian-mock";

describe("Title Extraction Utilities", () => {
  describe("decodeHtmlEntities", () => {
    it("should decode named HTML entities", () => {
      expect(decodeHtmlEntities("Tom &amp; Jerry &quot;Show&quot;")).toBe(
        'Tom & Jerry "Show"'
      );
      expect(decodeHtmlEntities("&lt;tag&gt;")).toBe("<tag>");
      expect(decodeHtmlEntities("It&#39;s &apos;good&apos; &nbsp;")).toBe(
        "It's 'good'  "
      );
    });

    it("should decode numeric HTML entities", () => {
      expect(decodeHtmlEntities("&#39;hello&#39;")).toBe("'hello'");
      expect(decodeHtmlEntities("&#x27;world&#x27;")).toBe("'world'");
    });
  });

  describe("extractTitle", () => {
    it("should extract title from basic HTML", () => {
      const html = "<html><head><title>My Test Title</title></head></html>";
      expect(extractTitle(html)).toBe("My Test Title");
    });

    it("should handle multiline title and normalize whitespace", () => {
      const html = `<html>
        <head>
          <title class="main">
            My   Multiline
            Title
          </title>
        </head>
      </html>`;
      expect(extractTitle(html)).toBe("My Multiline Title");
    });

    it("should decode HTML entities in title", () => {
      const html = "<title>Q&amp;A &ndash; Questions &amp; Answers</title>";
      expect(extractTitle(html)).toBe("Q&A – Questions & Answers");
    });

    it("should strip HTML tags inside title", () => {
      const html = "<title>Title with <span>nested</span> tag</title>";
      expect(extractTitle(html)).toBe("Title with nested tag");
    });

    it("should fallback to og:title if <title> is missing", () => {
      const html = `<html><head><meta property="og:title" content="OpenGraph Title" /></head></html>`;
      expect(extractTitle(html)).toBe("OpenGraph Title");
    });

    it("should return null if no title is found", () => {
      const html = "<html><head></head><body>No title here</body></html>";
      expect(extractTitle(html)).toBeNull();
    });
  });

  describe("fetchTitle", () => {
    beforeEach(() => {
      setRequestUrlMock(null);
    });

    afterEach(() => {
      setRequestUrlMock(null);
    });

    it("should fetch and extract title using requestUrl", async () => {
      setRequestUrlMock(async (req) => {
        expect(req.url).toBe("https://example.com");
        return {
          status: 200,
          text: "<html><head><title>Example Domain</title></head></html>",
        };
      });

      const title = await fetchTitle("https://example.com");
      expect(title).toBe("Example Domain");
    });

    it("should prepend https:// if missing scheme", async () => {
      setRequestUrlMock(async (req) => {
        expect(req.url).toBe("https://example.com");
        return {
          status: 200,
          text: "<html><head><title>Example Domain</title></head></html>",
        };
      });

      const title = await fetchTitle("example.com");
      expect(title).toBe("Example Domain");
    });

    it("should return null if fetch fails", async () => {
      setRequestUrlMock(async () => {
        throw new Error("Network error");
      });

      const title = await fetchTitle("https://invalid-domain-123.com");
      expect(title).toBeNull();
    });
  });
});
