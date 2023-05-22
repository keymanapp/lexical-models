// Defines LexicalModelSource.
/// <reference types="@keymanapp/lexical-model-compiler/dist/kmlmc.d.ts" />

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['example.tsv'],

  /**
   * CUSTOM WORD BREAKER:
   *
   * This is a small, fully-functional word breaker for English.
   *
   * Note, that for English, the default word breaker is more than
   * sufficient.
   *
   * However, for languages like Thai, Khmer, and Lao, a custom word breaker
   * is necessary.
   *
   * The entire purpose of this function is to take in arbitrary text, and
   * return a list of words as _spans_, in the same order as the text.
   *
   * In this example, we match a regular expression, however, you can use any
   * method that works for your language;  The only important thing is that
   * you return the correct spans.
   */
  wordBreaker: function (text: string): Span[] {
    // This pattern matches an English word:
    let matchWord = /[A-Za-z0-9']+/g;

    // We'll add words we found in this array:
    let words: Span[] = [];

    // matchWord.exec(text) returns one of these:
    let match: RegExpExecArray;

    // While we the regexp matches somewhere in the text
    while ((match = matchWord.exec(text)) !== null) {
      // Create a span!
      words.push({
        // This is the verbatim text:
        text: match[0],

        // This is the index in the text where the match can be found
        start: match.index,

        // This is the first index in the text AFTER the match.
        end: match.index + match[0].length,

        // This is the length of the match, as returned by JavaScript's
        // string.length.
        // For Unicode nerds, this is the length of the match in UTF-16 code
        // units -- this is NOT the same as the number of code points!
        length: match[0].length
      });
    }

    return words;
  },
};

export default source;
