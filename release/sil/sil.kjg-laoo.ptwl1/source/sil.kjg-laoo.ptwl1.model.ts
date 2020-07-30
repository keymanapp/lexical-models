/*
  ptwl1 1.0 generated from template.

  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: function(text): Span[] {
    /* All assigned characters in this range: https://www.unicode.org/charts/PDF/U0E80.pdf */
    const LAO = /^[\u0e81-\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf]+$/;

    let originalSpans = wordBreakers['default'](text);

    if (originalSpans.length < 1) {
      return [];
    }

    let spans = [];
    spans.push(originalSpans[0]);

    for (let i = 1; i < originalSpans.length; i++) {
      let previous = spans[spans.length - 1];
      let current = originalSpans[i];
      
      if (spansAreBackToBack(previous, current) && isLao(previous) && isLao(current)) {
        spans[spans.length - 1] = concatenateSpans(previous, current);
      } else {
        spans.push(current);
      }
    }

    return spans;

    function isLao(span: Span) {
      let text = span.text;
      return LAO.test(text);
    }

    /**
     * Returns true when the spans are contiguous.
     * Order matters when calling this function!
     */
    function spansAreBackToBack(former: Span, latter: Span): boolean {
      return former.end === latter.start;
    }

    function concatenateSpans(former: Span, latter: Span) {
      if (latter.start !== former.end) {
        throw new Error(`Cannot concatenate non-contiguous spans: ${JSON.stringify(former)}/${JSON.stringify(latter)}`);
      }

      return {
        start: former.start,
        end: latter.end,
        length: former.length + latter.length,
        text: former.text + latter.text
      };
    }
  }
  sources: ['wordlist.tsv'],
};
export default source;
