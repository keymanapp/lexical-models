Customizing the word breaker
============================

**See `./source/example.moh.customize_word_breaker.model.ts` for the
change**!


This example shows off how to customize the default word breaker.

For example, in Kanien'kéha (Mohawk), both the apostrophe (`'`) and the
colon (`:`) are valid word characters.

> konnòn:we's (I am liking something)

To prevent the word breaker from
splitting words on these, you can **customize the default word breaker**.

See [the documentation][docs] for more information

[docs]: https://help.keyman.com/developer/14.0/guides/lexical-models/advanced/word-breaker#join].
