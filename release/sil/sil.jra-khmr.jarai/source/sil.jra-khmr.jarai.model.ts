/*
  Jarai 1.0 generated from template.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  wordBreaker: function (str) {
  const tokens = str.split(/\s|\u200b/);

  for(let i=0; i < tokens.length; i++) {
    const token = tokens[i];
    if(token.length == 1) {
      continue;
    }

    // Certain punctuation marks should be considered a separate token from the word they're next to.
    const punctuationMarks = ['«', '»', '$', '#', ',', '.', ';' /* add extras here */];
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
        tokens.splice(i++, 0, left);
      }
      tokens.splice(i++, 1, punct);
      if(right) {
        tokens.splice(i, 0, right);
      }
      // Ensure that the next iteration puts `i` immediately after the punctuation token... even if
      // there was a `right` portion, as it may have extra marks that also need to be spun off.
      i--;
    }
   }
   return tokens.map(function(token) {
      return {
        left: str.indexOf(token),
        start: str.indexOf(token),
        right: str.indexOf(token) + token.length,
        end: str.indexOf(token) + token.length,
        text: token
      }
    });
},
punctuation: {
    insertAfterWord: "\u0020"
}
};
export default source;
