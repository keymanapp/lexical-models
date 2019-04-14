/**
 * Returns a data structure suitable for use by the trie wordlist model.
 *
 * Format specification:
 *
 *  - the file is a UTF-8 encoded text file
 *  - new lines are either LF or CRLF
 *  - the file either consists of a comment or an entry
 *  - comment lines MUST start with the '#' character
 *  - entries are one to three columns, separated by the (horizontal) tab
 *    character
 *  - column 1 (REQUIRED): the wordform: can have any character except tab, CR,
 *    LF. surrounding SPACE characters are trimmed.
 *  - column 2 (optional): the count: a non-negative integer specifying how many
 *    times this entry has appeared in the corpus. Blank means 'indeterminate'
 *  - column 3 (optional): comment: an informative comment, ignored by the tool.
 *
 * @param sourceFiles an array of the CONTENTS of source files
 * @return a data structure that will be used internally by the trie wordlist
 *         implemention. Currently this is an array of [wordlist, count] pairs.
 */
export function createTrieDataStructure(sourceFiles: string[]) {
  // Supports LF or CRLF line terminators.
  const NEWLINE_SEPARATOR = /\u000d?\u000a/;
  const TAB = "\t";
  let contents = sourceFiles.join('\n');
  // TODO: format validation.
  let lines = contents.split(NEWLINE_SEPARATOR);
  // NOTE: this generates a simple array of word forms --- not a trie!
  // In the future, this function may construct a true trie data structure,
  // but this is not yet implemented.
  let result: (string | number)[][] = [];
  for (let line of lines) {
    if (line.startsWith('#') || line === "") {
      continue; // skip comments and empty lines
    }
    let [wordform, countText, _comment] = line.split(TAB);
    // Clean the word form.
    // TODO: what happens if we get duplicate forms?
    wordform = wordform.normalize('NFC').trim();
    countText = (countText || '').trim();
    let count = parseInt(countText, 10);

    // When parsing a decimal integer fails (e.g., blank or something else):
    if (!isFinite(count)) {
      // TODO: is this the right thing to do?
      // Treat it like a hapax legonmenom -- it exist
      count = 1;
    }
    result.push([wordform, count]);
  }
  return JSON.stringify(result);
}
