/*
  Russian 1.2 generated from template.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,
  searchTermToKey: function (term: string): string {
    // Use this pattern to remove common diacritical marks (accents).
    // See: https://www.compart.com/en/unicode/block/U+0300
    const COMBINING_DIACRITICAL_MARKS = /[\u0300-\u036f]/g;

    // Lowercase each letter in the string INDIVIDUALLY.
    // Why individually? Some languages have context-sensitive lowercasing
    // rules (e.g., Greek), which we would like to avoid.
    // So we convert the string into an array of code points (Array.from(term)),
    // convert each individual code point to lowercase (.map(c => c.toLowerCase())),
    // and join the pieces back together again (.join(''))
    let lowercasedTerm = Array.from(term).map(c => c.toLowerCase()).join('');

    // Once it's lowercased, we convert it to NFKD normalization form
    // This does many things, such as:
    //
    //  - separating characters from their accents/diacritics
    //      e.g., "е" -> "е́" + "́ ́"
    //  - converting lookalike characters to a canonical ("regular") form
    //      e.g., ";" -> ";" (yes, those are two completely different characters!)
    let normalizedTerm = lowercasedTerm.normalize('NFKD');

    // Now, using the pattern defined above, replace each accent and diacritic with the
    // empty string. This effectively removes all accents and diacritics!
    //
    // e.g.,  "мѝкрокалькуля́тор" -> "микрокалькулятор"
    let termWithoutDiacritics = normalizedTerm.replace(COMBINING_DIACRITICAL_MARKS, '');

    // The resultant key is lowercased, and has no accents or diacritics.
    return termWithoutDiacritics.normalize('NFC');
  },
  punctuation: {
    quotesForKeepSuggestion: {
      open: "\u00AB",
      close: "\u00BB"
    }
  }
};
export default source;
