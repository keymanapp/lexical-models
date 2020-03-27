/*
  Me'en 1.1
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],
  searchTermToKey: function (term: string): string {
  // Use this pattern to remove common diacritical marks.
  // See: https://www.compart.com/en/unicode/block/U+0300
  const COMBINING_DIACRITICAL_MARKS = /[\u0300-\u036f]/g;

  // Converts to Unicode Normalization form D.
  // This means that MOST accents and diacritics have been "decomposed" and
  // are stored as separate characters. We can then remove these separate
  // characters!
  //
  // e.g., Å ? A + °
  let normalizedTerm = term.normalize('NFD');

  // Now, make it lowercase.
  //
  // e.g.,  A + ° ? a + °
  let lowercasedTerm = normalizedTerm.toLowerCase();

  // Now, using the pattern above replace each accent and diacritic with the
  // empty string. This effectively removes all accents and diacritics!
  //
  // e.g.,  a + ° ? a
  let termWithoutDiacritics = lowercasedTerm.replace(COMBINING_DIACRITICAL_MARKS, '')

  // The resultant key is lowercased, and has no accents or diacritics.
  return termWithoutDiacritics;
},
punctuation: {
  insertAfterWord: "",
},
};
export default source;
