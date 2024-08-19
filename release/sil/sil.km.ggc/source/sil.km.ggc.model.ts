/*
  Google Crawler 1.0 generated from template.

  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/


const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  wordBreaker: function (str) {
    const whitespaceRegex = /\s|\u200b|\n|\r/;
    const plainTokens = str.split(whitespaceRegex);

    for(let i=0; i < plainTokens.length; i++) {
      const token = plainTokens[i];
      if(token.length == 0) {
        plainTokens.splice(i, 1);
        i--;
        continue;
      } else if(token.length == 1 && whitespaceRegex.test(token)) {
        plainTokens.splice(i, 1);
        i--;
        continue;
      }

      // Certain punctuation marks should be considered a separate token from the word they're next to.
      const punctuationMarks = ['«', '»', '$', '#' /* add extras here */];
      const punctSplitIndices = [];

      // Find if and where each mark exists within the token
      for(let i = 0; i < punctuationMarks.length; i++) {
        const split = token.indexOf(punctuationMarks[i]);
        if(split >= 0) {
          punctSplitIndices.push(split);
        }
      }

      // Sort and pick the earliest mark's location.  If none exists, use -1.
      punctSplitIndices.sort();
      const splitPoint = punctSplitIndices[0] === undefined ? -1 : punctSplitIndices[0];

      if(splitPoint > -1) {
        const left = token.substring(0, splitPoint);  // (0, -1) => ''
        const punct = token.substring(splitPoint, splitPoint+1);
        const right = token.substring(splitPoint+1);  // Starting past the end of the string => ''

        if(left) {
          plainTokens.splice(i++, 0, left);
        }
        plainTokens.splice(i++, 1, punct);
        if(right) {
          plainTokens.splice(i, 0, right);
        }
        // Ensure that the next iteration puts `i` immediately after the punctuation token... even if
        // there was a `right` portion, as it may have extra marks that also need to be spun off.
        i--;
      }
    }

    let latestIndex = 0;
    return plainTokens.map(function(token) {
      const start = str.indexOf(token, latestIndex);
      latestIndex = start + token.length;
      return {
        left: start,
        start: start,
        right: start + token.length,
        end: start + token.length,
        length: token.length,
        text: token
      }
    });
  },
  punctuation: {
    insertAfterWord: "\u200B"
  }
};
export default source;
