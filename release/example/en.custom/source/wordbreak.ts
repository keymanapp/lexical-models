/*
  Naively treat any character that is not a letter as a wordbreaking character.
*/
class ExampleWordBreaker {
  // TODO:  Needs to reference a .d.ts file for type definitions!
  wordBreak(text: string): Array<number> {
    let regex = new RegExp(/[!a-zA-Z]/g);
  
    let indexesOf = function(string) {
      var match, indexes = [];
  
      while (match = regex.exec(string)) {
        indexes.push(match.index);
      }
  
      return indexes;
    }
  
    return indexesOf(text);
  }
}