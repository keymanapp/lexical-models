const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  searchTermToKey: (wordform: string, applyCasing: CasingFunction) => {
    // Refer to ${KEYMAN_ROOT}/developer/src/kmc-model/src/model-defaults.ts for
    // the original version.
    return Array.from(wordform
          .normalize('NFKD')
          // Remove any combining diacritics (if input is in NFKD)
          .replace(/[\u0300-\u036F]/g, '')
        ) // end of `Array.from`
        .map(function(c) {
          // Strip out all apostrophes and quotation marks; they are not distinct letters in English.
          // Is of particular relevance for apostrophes due to English contractions; lazy typers
          // often expect the apostrophe to be "filled in".
          return applyCasing('lower', c).replace(/['"‘’“”]/, '')
        })
        .join('');
  },
  sources: ['mtnt.tsv'],
  languageUsesCasing: true
};

export default source;
