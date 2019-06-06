English MTNT Corpus
===================

This language model is derived from the [MTNT corpus][MTNT], collected
by Paul Michel and Graham Neubig whom mined discussions from [Reddit][].
Although the MTNT corpus has multilingual text, we are only using
English text.

The corpus is comprised of people having casual conversations on the
internet. **Note that the corpus can be R-rated at times!**

 * Read the paper here: <http://www.cs.cmu.edu/~pmichel1/hosting/mtnt-emnlp.pdf>
 * View associated source code here: <https://github.com/pmichel31415/mtnt>

<details>
<summary>Academic Citation</summary>
```
@InProceedings{michel2018mtnt,
  author    = {Michel, Paul  and  Neubig, Graham},
  title     = {MTNT: A Testbed for Machine Translation of Noisy Text},
  booktitle = {Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing}
}
```
</details>

[MTNT]: http://www.cs.cmu.edu/~pmichel1/mtnt/
[Reddit]: https://reddit.com/

Maintainer
----------

Eddie Antonio Santos <easantos@ualberta.ca> 🙃

How the corpus was post-processed
---------------------------------

I concatenated both `monolingual/dev.en` and `monolingual/train.en` into
one file called `mtnt.en.txt`. Then, for each line (representing one
Reddit comment) I split words using Unicode's default word boundary
algorithm. I cleaned tokens by ensuring they are always in NFC, and
created types by lower-casing the words and removing common Latin
diacritics. I kept track both of the count of the type, and of the
different variations of the type. Variations are made mostly by
different letter-casing or different diacritics. Then, to create the
final wordlist, I selected the most common variation of each type.
