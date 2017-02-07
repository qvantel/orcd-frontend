#!/bin/bash

if [[ $OSTYPE == *"darwin"* ]]; then
    grunt
    cp -fr $PWD $HOME/grafana/plugins/
else
    sudo grunt
    cp -fr $PWD /var/lib/grafana/plugins/
fi

echo "Done moving files"
