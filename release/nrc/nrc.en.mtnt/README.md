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
© National Research Council Canada

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

Data filtering
--------------

The data was cleaned both manually and automatically to remove
objectionable terms. I initially used [profanties.en][] to remove
obviously bad words. I also went through about the top 4000 words to
remove anything I thought was probably offensive. Then I was inspired by
the [Seven dirty words](https://en.wikipedia.org/wiki/Seven_dirty_words)
to look for all variants and creative ways to embed these words within
other words. I searched _within_ words, and manually verified all of
them to avoid making that [clbuttic mistake][]. That was “fun”. This was
a pretty manual, and at times, subjective process. Exact replication may
not be guaranteed.


[profanities.en]: https://github.com/pmichel31415/mtnt/blob/master/resources/profanities.en
[clbuttic mistake]: https://thedailywtf.com/articles/The-Clbuttic-Mistake-
