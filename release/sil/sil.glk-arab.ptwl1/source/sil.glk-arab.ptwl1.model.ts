/*Gilaki wordlist ptwl1 1.0.2 */

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],
  punctuation: {
    quotesForKeepSuggestion: {
       open: "«", close: "»",
       isRTL: true
    },
  },
  searchTermToKey: function (term) {
    // This pattern removes common Arabic script combiing diacritics and the zero-width non-joiner.
    // Except, skip the ARABIC_MADDAH_ABOVE. We want that to stay with its base character ALEF
    const COMBINING_DIACRITICAL_MARKS = /[\u064b-\u0652\u0654-\u065f\u0670\u200C]/g;
   
    // Converts to Unicode Normalization form D.
    // This means that MOST accents and diacritics have been "decomposed" and
    // are stored as separate characters. We can then remove these separate
    // characters!
    // e.g., Å = A + °
    let normalizedTerm = term.normalize('NFD');
   
    // Now, using the pattern above replace each diacritic with the
    // empty string. This effectively removes all diacritics!
    // e.g.,  a + ° = a
    let termWithoutDiacritics = normalizedTerm.replace(COMBINING_DIACRITICAL_MARKS, '')
   
    // The resultant key is normalized and without diacritics
    return termWithoutDiacritics;
  },

};
export default source;
