/*
  Naively treat any character that is not a letter as a wordbreaking character.
*/
class ExampleWordBreaker {
  // TODO:  Needs to reference a .d.ts file for type definitions!
  break(text: string): string[] {
    let regex = new RegExp(/[!a-zA-Z]/g);
  
    let tokensOf = function(string: string) {
      var match: RegExpExecArray, tokens: string[] = [];
  
      while (match = regex.exec(string)) {
        tokens.push(match[0]);
      }
  
      return tokens;
    }
  
    return tokensOf(text);
  }
}