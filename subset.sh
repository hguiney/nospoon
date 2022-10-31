#!/bin/zsh

glyphhanger ./local/index.html --spider-limit=0 --family='Skolar Sans' --subset='public/style/fonts/skolar-sans/ttf/*.ttf' --formats=ttf --output=dist/style/fonts/skolar-sans &&

glyphhanger ./local/index.html --spider-limit=0 --family='Skolar Sans' --subset='public/style/fonts/skolar-sans/otf/*.otf' --formats=ttf,woff-zopfli,woff2 --output=dist/style/fonts/skolar-sans &&

glyphhanger ./local/index.html --spider-limit=0 --family='League Gothic' --subset='public/style/fonts/league-gothic/*.ttf' --formats=ttf --output=dist/style/fonts/league-gothic

glyphhanger ./local/index.html --spider-limit=0 --family='League Gothic' --subset='public/style/fonts/league-gothic/*.otf' --formats=ttf,woff-zopfli,woff2 --output=dist/style/fonts/league-gothic
