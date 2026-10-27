/*
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,
  wordBreaker: function(str: string) {
    let latestIndex = 0;

    let emptyToken = {
      left: str.length,
      start: str.length,
      right: str.length,
      end: str.length,
      length: 0,
      text: ''
    };

    let tokens = str.split(/\s|\u200b/);
    let finalizedTokens = tokens.map(function(token, index) {
      // Empty tokens need special handling.
      if(token == '') {
        // If it's in the middle of the text, remove it.  We probably
        // were given two adjacent spaces.
        if(index != tokens.length - 1) {
          return null;
        } else {
          // If it's at the end of the text, we're in a "new word"
          // position; make sure we indicate this well!
          return emptyToken;
        }
      }

      // Always check for the position after the end of the previous token.
      // The sequence should always be from start to end.
      const start = str.indexOf(token, latestIndex);
      latestIndex = start + token.length;
      return {
        left: start,
        start: start,
        right: start + token.length,
        end: start + token.length,
        length: token.length,
        text: token
      };
    }).filter((t) => !!t); // remove any `null` entries (for middle-of-text empty strings)

    // If a new word should be starting at the current caret position,
    // create an empty '' token to indicate this.
    let tailToken = finalizedTokens[finalizedTokens.length - 1];
    if(!tailToken || tailToken.end != str.length) {
      finalizedTokens.push(emptyToken);
    }

    return finalizedTokens;
  },
  punctuation: {
    insertAfterWord: ""
  }
};
export default source;
