#!/bin/bash
rm -rf "127.0.0.1:9292"
rm -rf local/

wget -r http://127.0.0.1:9292 \
  --domains 127.0.0.1 \
  --convert-links \
  --exclude-domains js.stripe.com,checkout.stripe.com,www.youtube.com,storage.googleapis.com,printaura.com

mv "127.0.0.1:9292" local