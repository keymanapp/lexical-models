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
* [keymanapp/keyman](https://github.com/keymanapp/keyman) repository must be cloned on your system (todo: compilers will be available via npm). See below for configuration.

### Build instructions

`npm install` must be run once to install the TypeScript compiler.

`build.sh` can be used to build all the models from the command line.

* Common `build.sh` parameters:
  * `-t, -test   Runs tests on models`
  * `-b, -build  Creates compiled models`
  * `-c, -clean  Cleans intermediate and output files`
  * `-s          Quiet build`
  * `[target]      The specific model(s) to build, e.g. release or release/example/en.template`
  
### Configuring the keymanapp/keyman repo

For a successful build, ensure you have either configured `$KEYMAN_ROOT` to point to the base folder of your local clone of the `keymanapp/keyman` repo, or manually run the following in the Keyman repo:

```
cd developer/js
npm install
npm run build
npm link .
```
