# smbPitchShifterJs

Stephan Bernsee's [http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/](code) compiled to javascript using emscripten. This version is using libsndfile for file loading (will be replaced with web audio) and libsamplerate to allow timestretching (might also be replaced, SDL or webaudio).

## Disclaimer
This readme is written for me to jog my memory. The code is not yet intended to be useful to anybody else. 

## Compiling c/c++
Code can be compiled with gcc for comparison with javascript. Requires [https://github.com/erikd/libsamplerate](libsamplerate ) and [https://github.com/erikd/libsndfile](libsndfile).
```
gcc -o test src/*.cpp -lsamplerate -lsndfile -I /usr/local/Cellar/libsndfile/1.0.28/include/ -I /usr/local/Cellar/libsamplerate/0.1.9/include/
```

This assumes your on MacOS and installed libsamplerate and libsndfile with Homebrew.

## Compiling to javascript

```
emcc -O3 -s EXPORTED_FUNCTIONS='["_mainf"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]'  -s WASM=1 -o phasevocoder.html *.cpp ../lib/libsamplerateRel.a ../lib/libsndfileRel.a -I /usr/local/Cellar/libsndfile/1.0.28/include/ -I /usr/local/Cellar/libsamplerate/0.1.9/include/
```

Here the main function has to be renamned to mainf and extern "C" has to be prepended. This is because I want to call the main function myself from javascript (otherwise it is run on automatically pageload). The generated html file is not used. The reason for compiling to html instead of js is because this will create some special glue for the WASM file. 
```
extern "C" int mainf(...)
```

## Example html
Example html that uses react is in the making. Should be possible to just "npm install" and "npm run build" soon...

## TODOs
- Use web audio for file loading instead of libsndfile
- Add SDL for samplerate conversion and maybe playback too? (SDL is included with emscripten).
- Create nice pitch/stretch wrapper API for javacript.

## Links
[https://mdahlgrengadd.github.io/smbPitchShifterJs](Demo)
[http://www.katjaas.nl/pitchshift/pitchshift.html](http://www.katjaas.nl/pitchshift/pitchshift.html)
