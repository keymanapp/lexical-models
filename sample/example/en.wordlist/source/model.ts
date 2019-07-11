import LexicalModelCompiler from "@keymanapp/developer-lexical-model-compiler"; 

(new LexicalModelCompiler).compile({
  format: 'trie-1.0',
  wordBreaking: 'ascii',
  //... metadata ...
  sources: ['example.tsv']
});
