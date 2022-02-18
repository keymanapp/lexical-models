/*
  Balochi 1.2 generated from template.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  searchTermToKey: function (term: string): string {
    // Remove common diacritical marks.
    // Skip 0653 (maddah above) since we don't want aleef with madda above to turn into aleef
    const COMBINING_DIACRITICAL_MARKS = /[\u064B-\u0652\u0654-\u065F]/g;
  
    // Converts to Unicode Normalization form D.
    // This means that MOST accents and diacritics have been "decomposed" and
    // are stored as separate characters. We can then remove these separate
    // characters!
    //
    // e.g., Å ? A + °
    let normalizedTerm = term.normalize('NFC');
  
    // Now, make it lowercase.
    //
    // not needed for Arabic script
    //let lowercasedTerm = normalizedTerm.toLowerCase();
  
    // Now, using the pattern above replace each accent and diacritic with the
    // empty string. This effectively removes all accents and diacritics!
    //
    // e.g.,  a + ° ? a
    let termWithoutDiacritics = normalizedTerm.replace(COMBINING_DIACRITICAL_MARKS, '')
  
    // The resultant key has no accents or diacritics.
    return termWithoutDiacritics;
  },
};
export default source;
