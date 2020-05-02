const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['example.tsv'],
  wordBreaker: function (text: string): Span[] {
    // This pattern matches an English word:
    let matchWord = /[A-Za-z0-9']+/g;
    let words: Span[] = [];
    let match: RegExpExecArray;
    // While we find words in the text...
    while ((match = matchWord.exec(text)) !== null) {
      // Add it!
      words.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        length: match[0].length
      });
    }

    return words;
  },
};

export default source;
