import LexicalModelCompiler from "../../../../tools/index";

(new LexicalModelCompiler).compile({
  format: 'trie-1.0',
  wordBreaking: 'ascii',
  //... metadata ...
  sources: ['example.tsv']
});
