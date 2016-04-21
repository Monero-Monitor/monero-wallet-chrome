#!/bin/sh

echo "\nGetting github dependencies...\n==============================\n"
if [ ! -d "./github" ]; then
  mkdir github
fi
cd github

# Get correct version of qrcode.js
if [ ! -d "qrcode" ]; then
  git clone https://github.com/davidshimjs/qrcodejs
fi
cd qrcodejs
git checkout 04f46c6a0708418cb7b96fc563eacae0fbf77674
cd ..

cd ..

echo "\nCopying github dependencies...\n==============================\n"
if [ ! -d "./lib/js/deps" ]; then
  mkdir ./lib/js/deps
fi

if [ ! -d "./lib/js/deps/qrcode" ]; then
  mkdir ./lib/js/deps/qrcode
fi
cp github/qrcodejs/qrcode.min.js lib/js/deps/qrcode/.
cp github/qrcodejs/LICENSE lib/js/deps/qrcode/.

echo "\nSyncing chrome directory...\n===========================\n"
if [ ! -d "./build" ]; then
  mkdir ./build
fi
if [ ! -d "./build/chrome" ]; then
  mkdir ./build/chrome
fi
rsync -a --exclude-from=./exclude-chrome.txt . build/chrome/. --delete-after

echo "\nZipping chrome extension...\n===========================\n"
mv build/chrome.zip build/chrome-old.zip
zip -r build/chrome.zip build/chrome

echo "\n========\n > Extension located in ./build/chrome.zip\n"
