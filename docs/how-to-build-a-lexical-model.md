---
Author: Eddie Antonio Santos
Date: July 22, 2019
Keyman Version: 12.0.7-alpha-e58173f
---

How to build a lexical model
============================

A **lexical model** or a **dictionary** is a way to enable **predictive text**
for your keyboard.

Requirements
------------

You will need to have:

 - [Node.js][] >= 10.0
 - (Windows only) [Git Bash](https://gitforwindows.org/)


[Node.js]: https://nodejs.org/en/


Step 1: Get some data
---------------------

To predict words in your language, a lexical model needs to know the
words in your language!

Ultimately, the **lexical model compiler** requires a tab-separated
values (TSV) file, described in the [appendix][]. However, most users will use
a **spreadsheet** app like [Google Sheets][] or [Microsoft Excel][] to
create this TSV file.

[Google Sheets]: https://sheets.google.com/
[Microsoft Excel]: https://products.office.com/en/excel


### Example

I have words in my language of choice, SENĆOŦEN.

Here is my list of words, with the count of how many times I've seen the
word:

| Word  | Count   |
|-------|---------|
| TŦE   | 13644   |
| E     | 9134    |
| SEN   | 4816    |
| Ȼ     | 3479    |
| SW̱    | 2621    |
| NIȽ   | 2314    |
| U¸    | 2298    |
| I¸    | 1988    |
| ȻSE   | 1925    |
| I     | 1884    |

I've entered this information into my spreadsheet of choice, [Google
Sheets][]. I've shared this spreadsheet publicly [here][sencoten-sheet].
The order of the columns matters:

The first column **MUST** be the words, and the second column **MUST**
be the counts. Additional columns are ignored. The spreadsheet can also
be a single column of all of the words in the language.

This is what my word list looks like in Google Sheets:

![The word list, as it appears in Google Sheets](./sencoten-sheets-full.png).

[sencoten-sheet]: https://docs.google.com/spreadsheets/d/10zhIc439BCSSooL_-HeJ6TUHd-ovkiXYcIGe-pHDTSg/edit?usp=sharing
zsh:1: no matches found: https://docs.google.com/spreadsheets/d/10zhIc439BCSSooL_-HeJ6TUHd-ovkiXYcIGe-pHDTSg/edit?usp=sharing
zsh:1: no matches found: https://docs.google.com/spreadsheets/d/10zhIc439BCSSooL_-HeJ6TUHd-ovkiXYcIGe-pHDTSg/edit?usp=sharing

Now, we download the spreadsheet in the [required
format](#appendix:tsv). To do this, in Google Sheets, select "File"
» "Download as" » "Tab-separated values (.tsv, current sheet)".

![Exporting the TSV file from Google Sheets](./sencoten-sheets-save-as.png)

I'll save mine as **wordlist.tsv**.


Step 2: Create a unique model ID
--------------------------------

Now that we have our TSV file, called **wordlist.tsv**, let's create the
associated packaging folder and data.

Our model needs a **unique ID**. The lexical model ID is a string in the
format:

> _author_._bcp47_._uniq_


### Author

_author_ is an identifier for the maintainer of the model. This
identifier is a string of one or more ASCII lowercase letters, digits, and the
underscore (`_`), and it must begin with a lowercase ASCII letter. Some
organizations have a author identifier already, like `sil` for SIL
International, `nrc` for the National Research Council Canada, and `fv`
for FirstVoices.

### BCP 47

_bcp47_ is the [BCP 47][] tag of the language, script, and region you
are modelling. If you need to uses dashes in your language's BCP 47 tag,
replace them with underscores; likewise, replace uppercase letters with
lowercase letters.

Typically, this will just be the [ISO 639-3][] code of your language,
and nothing else. In the case of SENĆOŦEN, [its ISO 639-3 code is
`str`](https://iso639-3.sil.org/code/str).

In some cases, you will have to specify the script (writing system), and
the region. For example, if I'm creating a model for Plains Cree (ISO
639-3: `crk`) it can be written both in the Latin script ([ISO 15924][]:
`Latn`) and in Unified Canadian Aboriginal Syllabics ([ISO 15924][]:
`Cans`). Say my model is only designed for syllabics. The correct BCP 47 tag
is:

    crk-Cans

However, to create a valid lexical model ID, we need to replace the
dash with an underscores, and convert all uppercase letters to
lowercase. Thus, our `bcp47` is:

    crk_cans

[ISO 639-3]: https://iso639-3.sil.org/code_tables/639/data
[ISO 15924]: https://en.wikipedia.org/wiki/ISO_15924
[BCP 47]: https://tools.ietf.org/html/bcp47

### Uniq

_uniq_ is an arbitrary tag that uniquely identifies your specific model.
This identifier can be anything, as long as it hasn't already been used
before for this specific language. As with `author`
identifier is one or more ASCII lowercase letters, digits, and the underscore
(`_`), and it must start with a lowercase ASCII letter.

### Example

My author is called `example`, and the BCP 47 for my language is `str`.
I'll give my model the unique tag of `tutorial`. Thus my unique model
is:

    example.str.tutorial


Step 4: Creating the package files
----------------------------------

Now that we have a unique ID for our model, and wordlist data, we can
the appropriate packaging files.

Say we're currently in a folder called `release`: our model will follow
this template for its directory structure.

```
release/
└── {author}/
    └── {bcp47}.{uniq}/
        ├── {author}.{bcp47}.{uniq}.model_info
        └── source/
            ├── {author}.{bcp47}.{uniq}.model.kps
            ├── wordlist.tsv
            └── model.ts
```

Notice how under `release`, there is a folder that is named after the
author. Within that folder is a folder for each models created by that
particular author. Within each model folder, this is a folder called
`source` that contains **wordlist.tsv**. We will discuss what the other
files are called a bit later in this document.

For our example of `example.str.tutorial`, I'll want the following
folder structure:

```
release/
└── example/
    └── str.tutorial/
        ├── example.str.tutorial.model_info
        └── source/
            ├── example.str.tutorial.model.kps
            ├── wordlist.tsv
            └── model.ts
```

To create this folder structure, I can execute the following code in
the Git Bash/the terminal:
    cd /type/the/path/to/release
    mkdir -p example/str.tutorial/source

Now move the wordlist to the appropriate place:

    mv /type/the/current/path/to/wordlist.tsv example/str.tutorial/source/

I now have the following folder structure:

```
.
└── example
    └── str.tutorial
        └── source
            └── wordlist.tsv
```

We need to create the remaining files:
 - The "model info" file: `example.str.tutorial.model_info`
 - The package file: `example.str.tutorial.model.kps`
 - The model configuration file: `model.ts`


Step 4.1: Creating the model info file
--------------------------------------

The model info contains a little bit of metadata that is required when
distributing packages. It is a JSON file that lists the model license
and a short description of the lexical model.

The `.model_info` file should follow this template:

```json
{
    "license": "<SPDX license identifier>",
    "description": "<short description of the lexical model>"
}
```

Copy this template, and use it to create your own `.model_info` file.

Save this file to `{author}/{bcp47}.{uniq}/{author}.{bcp47}.{uniq}.model_info`.

> NOTE: the only current valid value for `license` is `"mit"`.


In our `example.str.tutorial` example, I'll use the following
`.model_info`.

```json
{
    "license": "mit",
    "description": "Predicts words in the SENĆOŦEN language (Saanich Dialect)"
}
```

I'll save this file to `example/str.tutorial/example.str.tutorial.model_info`.


Step 4.2: Creating the KPS file
-------------------------------

**TODO:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<Package>
  <System>
    <KeymanDeveloperVersion>12.0.1500.0</KeymanDeveloperVersion>
    <FileVersion>12.0</FileVersion>
  </System>
  <Options>
    <FollowKeyboardVersion/>
  </Options>
  <Info>
    <Name URL="">SENĆOŦEN (Saanich Dialect) Lexical Model</Name>
    <Copyright URL="">© 2019 National Research Council Canada</Copyright>
    <Author URL="mailto:Eddie.Santos@nrc-cnrc.gc.ca">Eddie Antonio Santos</Author>
    <Version>1.0.3</Version>
  </Info>
  <Files>
    <File>
      <Name>..\build\nrc.str.sencoten.model.js</Name>
      <Description>Lexical model nrc.str.sencoten.model.js</Description>
      <CopyLocation>0</CopyLocation>
      <FileType>.model.js</FileType>
    </File>
  </Files>
  <LexicalModels>
    <LexicalModel>
      <Name>SENĆOŦEN dictionary</Name>
      <ID>nrc.str.sencoten</ID>
      <Version>1.0.3</Version>
      <Languages>
        <Language ID="str">North Straits Salish</Language>
        <Language ID="str-Latn">SENĆOŦEN</Language>
      </Languages>
    </LexicalModel>
  </LexicalModels>
</Package>
```

Step 4.3: Creating the model file
---------------------------------

```typescript
import LexicalModelCompiler from "@keymanapp/developer-lexical-model-compiler";

(new LexicalModelCompiler).compile({
  format: 'trie-1.0',
  wordBreaking: 'default',
  sources: ['saanich.tsv'],
});
```


Appendix: Tab-separated wordlist file format specification
----------------------------------------------------------

<a id="appendix:tsv"></a>

[appendix]: ./#appendix:tsv

The **lexical model compiler** expects wordlists to abide by the
following **tab-separated values** (TSV) format:

 - the file is must be **UTF-8** encoded text file
 - newlines are either **LF** or **CRLF**
 - the file either consists of a **comment** or an **entry**
 - **comment** lines MUST start with the '#' character on the very first column
 - **entries** are one or two columns, separated by the (horizontal)
   **tab character** (U+0009)
 - column 1 (REQUIRED): the **word form**: can have any character
   except tab, CR, or LF. Surrounding whitespace characters are trimmed.
 - column 2 (optional): the **count**: a non-negative integer specifying how many
   times this entry has appeared in the corpus. Blank means
   'indeterminate', and is treated as if the word exists in the corpus,
   but will be predicted at the lowest possible priority.
 - the following columns are ignored.

> Source:
> [build-trie.js@e58173f](https://github.com/keymanapp/keyman/blob/307436e7c24caa5c720b272640184362c4dc3223/developer/js/lexical-model-compiler/build-trie.ts#L21-L66)

Exporting a spreadsheet from Google Sheets as a TSV will produce
properly formatted output. I have not found a reliable output option in
Microsoft Excel for Mac that will produce output in the expected format.
