
interface LexicalModel {
  readonly format: 'trie-1.0'|'fst-foma-1.0'|'custom-1.0',
  readonly wordBreaking?: {
    allowedCharacters?: { initials?: string, medials?: string, finals?: string } | string,
    defaultBreakCharacter?: string
    sources?: Array<string>;
    /**
     * The name of the type to instantiate (without parameters) as the base object for a custom word-breaking model.
     */
    rootClass?: string
  },
  //... metadata ...
}

interface LexicalModelPrediction {
  display?: string;
  transform: string;
  delete: number;
}

interface LexicalModelSource extends LexicalModel {
  readonly sources: Array<string>;
  /**
   * The name of the type to instantiate (without parameters) as the base object for a custom predictive model.
   */
  readonly rootClass?: string
}

interface LexicalModelCompiled extends LexicalModel {
  readonly id: string;
}

interface LexicalModelCompiledTrie extends LexicalModelCompiled {
  trie: string;
}

interface LexicalModelCompiledFst extends LexicalModelCompiled {
  fst: string;
}

interface LexicalModelCompiledCustom extends LexicalModelCompiled {
}
