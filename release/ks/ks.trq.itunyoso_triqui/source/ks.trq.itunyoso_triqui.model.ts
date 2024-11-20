/*
  Itunyoso Triqui 1.0 generated from template.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https:help.keyman.com/developer/ for
  additional parameters.
*/


const source: LexicalModelSource = {
  format: 'trie-1.0',
  earchTermToKey: function (term: string): string {
  
    // Use this pattern to remove common diacritical marks (accents).
    // See: https:www.compart.com/en/unicode/block/U+0300
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
   
    //  - separating characters from their accents/diacritics
    //      e.g., "ï" -> "i" + "◌̈"
    //  - converting lookalike characters to a canonical ("regular") form
    //      e.g., ";" -> ";" (yes, those are two completely different characters!)
    //  - converting "compatible" characters to their canonical ("regular") form
    //      e.g., "𝔥𝔢𝔩𝔩𝔬" -> "hello"
   let normalizedTerm = lowercasedTerm.normalize('NFKD');

    // Now, using the pattern defined above, replace each accent and diacritic with the
    // empty string. This effectively removes all accents and diacritics!
   
    // e.g.,  "i" + "◌̈" -> "i"
   let termWithoutDiacritics = normalizedTerm.replace(COMBINING_DIACRITICAL_MARKS, '');

   let termWithoutDoubles = normalizedTerm.replace('(.).', '$1');
   let beginnerMode = beginnerMode.replace('([aeiou])n?[hj]?$', '$1')
   let beginnerMode = beginnerMode.replace('([aeiou])h([aeiou])', '$1')

    // The resultant key is lowercased, and has no accents or diacritics.
   return beginnerMode;
},
  sources: ['triquifrequencies.tsv'],
  languageUsesCasing: true
};

export default source;
