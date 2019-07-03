import LexicalModelCompiler from "@keymanapp/developer-lexical-model-compiler"; 

(new LexicalModelCompiler).compile({
  format: 'trie-1.0',
  wordBreaking: 'default',
  sources: ['mtnt.tsv']
});
