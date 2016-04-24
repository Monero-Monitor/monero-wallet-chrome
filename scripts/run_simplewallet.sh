#!/bin/sh

# 
# Monero Simplewallet Launcher, (c) 2016 bigreddmachine.
# https://github.com/Monero-Monitor/monero-wallet-chrome
# 
# This script allows simplewallet to be run in rpc mode easily and quickly. User passwords
# are secured by passing them as a terminal input, rather than requiring them to be stored
# as clear text in the script.
# 
# This script is released under the MIT License.
#

clear
cd ~/Monero-Wallet-Chrome
FILE="ChromeWallet.bin"

echo "\n===================================================================================="
echo "                            Monero Simplewallet Launcher\n"
echo "Copyright (c) 2016 bigreddmachine."
echo "Released under the MIT License as part of Monero Wallet for Chrome."
echo "https://github.com/monero-monitor/monero-wallet-chrome"
echo "====================================================================================\n"

if [ -e "$FILE" ]; then
    # If this script has been run previously, a wallet should already exist. Start it in RPC mode.
    echo "Launching simplewallet in RPC mode, listening on localhost (127.0.0.1), port 18082.\n"
    echo "Please enter your password: "
    read -s PASS
    
    screen -S SimpleWalletRPC -d -m simplewallet --wallet-file $FILE --password $PASS --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082
    
    echo "Launching simplewallet...\n"
    sleep 3
    echo "----------------------"
    
    echo "\nReturning wallet address:"
    if curl --fail -X POST http://127.0.0.1:18082/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"getaddress"}' -H 'Content-Type: application/json'; then
        echo "\n\n  Simplewallet is now running in RPC mode. To shutdown simplewallet, choose 'Stop Wallet' in the extension's menu.\n"
        read -p "  Thank you for using Monero Wallet for Chrome! Press 'enter' to close the application."
    else
        echo "\n  Please check if your extension shows that simplewallet online. If not,"
        read -p "  please check your password and try again. Press 'enter' to close the application."
    fi
else
    # The first time this script is run, open the command line wallet.
    echo "You have not created a wallet yet. This script will help you do that.\n"
    echo "To create a wallet, follow the prompts. Enter a password, then pick a"
    echo "language for your wallet.\n"
    echo "Once you have created a wallet, simplewallet will open and a prompt"
    echo "line will appear. Type 'refresh', then once it is done type 'exit'."
    echo "You are then ready to use Monero Wallet for Chrome.\n"
    read -p "When you are ready to begin, press enter... "
    
    echo "\n----------"
    echo "Please pick a password for your new wallet: "
    read -s NEWPASS
    echo "----------\n"
    
    simplewallet --generate-new-wallet $FILE --password $NEWPASS
    
    echo "\n----------\n"
    
    if [ -e "$FILE" ]; then
        echo "  Everything looks good. You can now start your wallet in RPC mode at any time by re-running this script.\n"
        read -p "  Press 'enter' to close Monero Simplewallet Launcher.\n\n"
    else
        read -p "  There seems to have been an issue creating your wallet. Press 'enter' to close this dialog."
    fi
fi