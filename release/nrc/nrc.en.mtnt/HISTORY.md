# Version History

## 0.3.3 (2024-09-09)

* Rebuild with 17.0.329 compiler to address missing low-frequency words

## 0.3.2 (2024-04-03)

* space corrected to tab in .tsv file

## 0.3.1 (2024-03-07)

* Fixes handling of words with apostrophes, allowing them to be suggested more easily
* A misspelling correction

## 0.3.0 (2024-02-15)

* Major cleanup:
* Non-words removed (including some acronyms)
* misspellings corrected (both US and UK/Canadian/Australian spellings preserved)
* most proper names removed (except names of continents, countries, nationalities, religions)
* some proper names made lower case (Cardinals to cardinals) though the frequency count unchanged

## 0.2.0 (2023-02-13)

* Lower-case some common words
* Remove single-characters and decimal numbers

## 0.1.9 (2022-11-20)

* Replace "left single quotation mark" with "apostrophe" (#143)

## 0.1.8 (2022-04-13)

* Removed typos and non-Latin characters

## 0.1.7 (2021-03-19)

* Fixes a bug that prevented use on Android 5.0 devices (keymanapp/keyman#4718)

## 0.1.6

* Fixes a bug that broke word weighting, which affected the quality of suggestions (keymanapp/keyman#4504)

## 0.1.5

* Enables use of Keyman 14's case-detection & capitalization modeling features

## 0.1.4

* Clean up versioning in .kps package file

## 0.1.3

* Removed two extraneous SMP characters from dataset to work around an issue in Keyman (keymanapp/keyman#2374)

## 0.1.2

* Reorganize `example.en.mtnt` to `nrc.en.mtnt` (#48)

## 0.1.0

* Initial release as `example.en.mtnt` (#42)
