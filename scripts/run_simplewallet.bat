REM Monero Simplewallet Launcher, (c) 2016 bigreddmachine.
REM https://github.com/Monero-Monitor/monero-wallet-chrome
REM 
REM This script allows simplewallet to be run in rpc mode easily and quickly. User passwords
REM are secured by passing them as a terminal input, rather than requiring them to be stored
REM as clear text in the script.
REM 
REM This script is released under the MIT License.

@echo off
cls
set FILE=ChromeWallet.bin

echo.
echo ====================================================================================
echo                             Monero Simplewallet Launcher
echo.
echo Copyright (c) 2016 bigreddmachine.
echo Released under the MIT License as part of Monero Wallet for Chrome.
echo https://github.com/monero-monitor/monero-wallet-chrome
echo ====================================================================================
echo.

if exist %FILE% (
    REM If this script has been run previously, a wallet should already exist. Start it in RPC mode.
    
    echo Launching simplewallet in RPC mode, listening on localhost (127.0.0.1), port 18082.
    echo.
    set /p PASS=Please enter your password: 
    
    start "simplewallet --wallet-file %FILE% --password %PASS% --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082"
    
    echo Launching simplewallet...
    echo.
    sleep 3
    echo ----------------------
    
    echo.
    echo Returning wallet address:
    
    if (curl --fail -X POST http://127.0.0.1:18082/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"getaddress"}' -H 'Content-Type: application/json'; then
        
        echo.
        echo.
        echo Simplewallet is now running in RPC mode. To shutdown simplewallet, choose 'Stop Wallet' in the extension's menu.
        echo.
        echo Thank you for using Monero Wallet for Chrome! You may now close this window.
        echo.
        
    ) else (
        
        echo.
        echo Please check if your extension shows that simplewallet online. If not,
        echo please check your password and try again.
        echo.
        
    )
) else (
    REM The first time this script is run, open the command line wallet.
    
    echo You have not created a wallet yet. This script will help you do that.
    echo.
    echo To create a wallet, follow the prompts. Enter a password, then pick a
    echo language for your wallet.
    echo.
    echo Once you have created a wallet, simplewallet will open and a prompt
    echo line will appear. Type 'refresh', then once it is done type 'exit'.
    echo You are then ready to use Monero Wallet for Chrome.
    echo.
    
    set /p userinput=When you are ready to begin, press enter...
    
    echo.
    echo ----------
    set /p NEWPASS=Please pick a password for your new wallet: 
    echo ----------
    echo.
    
    simplewallet --generate-new-wallet %FILE% --password $NEWPASS
    
    echo.
    echo ----------
    echo.
    
    if exist %FILE% (
        echo   Everything looks good. You can now start your wallet in RPC mode at any time by re-running this script.
        echo.
        echo   Closing Monero Simplewallet Launcher...
        echo.
        echo.
    )
)