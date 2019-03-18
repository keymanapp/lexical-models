# lexical-models
Lexical language models for predictive text in Keyman

This does not build freshly cloned. To build, first get a typescript compiler.

To get a typescript compiler:
```bash
npm install
```

Running build.sh isn't convenient when freshly cloned. To fix the permissions:
```bash
chmod a+x ./build.sh
```

To compile the models:
```bash
./build.sh
```

You should now have build folders with kmp files in there.
```bash
ls -l release/example/
```

Should show at least the wordlist and custom lexical models:

```
drwxr-xr-x  5 rboring  staff  160 Mar 17 23:14 en.custom
drwxr-xr-x  5 rboring  staff  160 Mar 17 23:14 en.wordlist
```
