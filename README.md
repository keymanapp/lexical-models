# Open Source Keyman lexical models

## File Layout

Models are grouped into two folders:

  * `release` -
  * `experimental` -

Within each of the folders, models are further grouped by the template `author`/`bcp47`.[`uniq`].
For example, the folder structure may be:
  * release/example/en.custom/

The components must be lower case and are:
  * *author*: a short unique identifier, such as `nrc` or `sil`.
  * *bcp47*: the canonical BCP 47 tag for the model. For example *km* for Khmer, or *en-au* for Australian English.
  * *uniq*: an optional component that can be provided when a given language has multiple models from a single author. For example, `en.custom` vs `en.wordlist`. We do recommend always using a uniquifer even if there are no current plans to produce more than one for a language.
  

## Building Models

### Preqrequisites

* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads) for your platform
* You will need to use **Git Bash** or equivalent to build.

### Build instructions

`build.sh` can be used to build all the models from the command line.

* Common `build.sh` parameters:
  * `-t, -test   Runs tests on models`
  * `-b, -build  Creates compiled models`
  * `-c, -clean  Cleans intermediate and output files`
  * `-no-npm     Skip all npm steps`
  * `-s          Quiet build`
  * `[target]      The specific model(s) to build, e.g. release or release/example/en.template`
