# Externally hosted lexical models

Lexical models may be hosted in three different ways:

1. Within this repository.
2. Within another repository, hosted on github.com
3. As compiled files only, hosted on any web server

The presence of the file `external_source` in a model folder in the
repository determines the hosting location of the model.

If the file `external_source` is present, only three files are permitted in the
folder:

* `external_source`: instructions on where to find the model files
* `README_EXTERNAL.md`: brief description of the model for repository
  browsers
* `.gitignore`: a template file setup to ignore all files apart from these three
  in the folder. This file will be rewritten by the build if it does not match:

  ```
  # Only specific files may be added to repository for external references
  *
  !external_source
  !README_EXTERNAL.md
  !.gitignore
  ```

## Within this repository

This is documented on https://help.keyman.com/developer/. The file
`external_source` must not exist in the model folder.

## Within another repository

The file `external_source` must contain a single line, with a reference to a
specific tree commit in a repository on github.com, for example:

```
https://github.com/mcdurdin/experiment.en.external_experiment/tree/893b2d5db26876db0a3bcbd8db3b398e00bbd697
```

It is also possible to point to a specific folder within a repository as well,
allowing for hosting of multiple models within a single repository.

Models referenced in this way must still conform to the requirements for
all models hosted in this repository, including using the MIT license,
matching the specified file layout, and containing all the required metadata as
documented at https://help.keyman.com/developer/lexical-models/.

Publishing an update to a model will generate a new git sha hash, which will
necessitate an update to the `external_source` file.

## As compiled files with URL references

This repository supports sourcing compiled model files from an arbitrary web
server. However, the repository maintainers can only accept compiled model
files when SIL has a current contractual agreement with the supplier of the
model files that covers this usage. Under normal circumstances, you should
host model source files either here or within another public repository on
github.com.


The file `external_source` must contain one line for each file to be downloaded,
in a `file=url` format. For example:

```
experiment.en.external_binary.model_info=https://github.com/mcdurdin/experiment.en.external_binary/releases/download/v1.0/experiment.en.external_binary.model_info
source/experiment.en.external_binary.model.kmp=https://github.com/mcdurdin/experiment.en.external_binary/releases/download/v1.0/experiment.en.external_binary.model.kmp
source/experiment.en.external_binary.model.js=https://github.com/mcdurdin/experiment.en.external_binary/releases/download/v1.0/experiment.en.external_binary.model.js
```

The `.model_info` file must contain all metadata that a compiled model normally
has. See examples from built models elsewhere in this repository for examples.

# Compiling externally hosted models

The build script will automatically download model source and/or compiled files
once it finds the `external_source` file. If the folder contains files other than
the three permitted files listed above, the build will fail.

This would download the source repository for external_experiment_1 and build the
model:

```
./build.sh experimental/experiment/experiment.en.external_experiment
```

Following a build, the folder will contain additional files which must be
removed before you can run the build again by running with the `-c` parameter to
clean the folder:

```
./build.sh -c experimental/experiment/experiment.en.external_experiment
```

Otherwise, the build will abort when any additional files are present, to avoid
accidental overwriting of data.
