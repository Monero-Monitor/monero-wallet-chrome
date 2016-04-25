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

echo "\n===================================================================================="
echo "                       Monero Simplewallet Launcher for OS X\n"
echo "Copyright (c) 2016 bigreddmachine."
echo "Released under the MIT License as part of Monero Wallet for Chrome."
echo "https://github.com/monero-monitor/monero-wallet-chrome"
echo "====================================================================================\n"

mkdir -p ~/.MoneroWalletChrome

sleep 1

cd ~/.MoneroWalletChrome
FILE="wallet.bin"

echo "Would you like to connect to a remote Monero daemon or use your own?"
echo "  1) remote:   node.moneroclub.com:8880"
echo "  2) local:    127.0.0.1:18081\n"
read -p "Please make a selection: " DAEMON

if [ $DAEMON -ne 1 ] && [ $DAEMON -ne 2 ]; then
    read -p "Invalid daemon selection. Press enter to quit."
    exit
fi

if [ -e "$FILE" ]; then
    # If this script has been run previously, a wallet should already exist. Start it in RPC mode.
    echo "Launching simplewallet in RPC mode, listening on localhost (127.0.0.1), port 18082.\n"
    echo "Please enter your password: "
    read -s PASS
    
    if [ $DAEMON -eq 1 ]; then
        screen -S SimpleWalletRPC -d -m ~/MoneroWallet/simplewallet --wallet-file $FILE --password $PASS --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082 --daemon-address node.moneroclub.com:8880
    else
        screen -S SimpleWalletRPC -d -m ~/MoneroWallet/simplewallet --wallet-file $FILE --password $PASS --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082
    fi
    
    echo "Launching simplewallet...\n"
    sleep 3
    echo "----------------------"
    
    echo "\nReturning wallet address:"
    if curl --fail -X POST http://127.0.0.1:18082/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"getaddress"}' -H 'Content-Type: application/json'; then
        echo "\n\n  Simplewallet is now running in RPC mode. To shutdown simplewallet, choose 'Stop Wallet' in the extension's menu.\n"
        read -p "  Thank you for using Monero Wallet for Chrome! Press 'enter' to close this dialog. Simplewallet will continue running in the background."
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
    
    if [ $DAEMON -eq 1 ]; then
        ~/MoneroWallet/simplewallet --generate-new-wallet $FILE --password $NEWPASS --daemon-address node.moneroclub.com:8880
    else
        ~/MoneroWallet/simplewallet --generate-new-wallet $FILE --password $NEWPASS
    fi
    
    echo "\n----------\n"
    
    if [ -e "$FILE" ]; then
        echo "  Everything looks good. You can now start your wallet in RPC mode at any time by re-running this script.\n"
        read -p "  Press 'enter' to close Monero Simplewallet Launcher."
    else
        read -p "  There seems to have been an issue creating your wallet. Press 'enter' to close this dialog."
    fi
fi