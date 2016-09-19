# Getting Started with monero-wallet-cli

Thanks for choosing Monero Wallet for Chrome! To use the Monero Wallet for Chrome extension,
you'll need to install and set up Monero's monero-wallet-cli.

The basic flow is as follows:

1. Download the official releases for your system from [getmonero.org](https://getmonero.org/downloads/).
2. Unzip and save the downloaded files in a place you will remember.
3. Set up your monero-wallet-cli on RPC mode.

To set up your wallet, you can use our [pre-configured setup scripts](#use-our-pre-configured-monero-wallet-cli-setup)
or follow the [instructions below to make your own](#configure-monero-wallet-cli-yourself).

## Table of Contents

1. [Getting Started with monero-wallet-cli](#getting-started-with-monero-wallet-cli)
2. [Use our pre-configured monero-wallet-cli setup](#use-our-pre-configured-monero-wallet-cli-setup)
3. [Configure monero-wallet-cli Yourself](#configure-monero-wallet-cli-yourself)
   1. [Opening monero-wallet-cli for the first time](#opening-monero-wallet-cli-for-the-first-time)
   2. [Running monero-wallet-cli in JSON RPC mode](#running-monero-wallet-cli-in-json-rpc-mode)
   3. [Running monero-wallet-cli headless in JSON RPC mode](#running-monero-wallet-cli-headless-in-json-rpc-mode)
   4. [Automating all the things](#automating-all-the-things)


# Use our pre-configured monero-wallet-cli setup

If you want to skip the hassle of configuring your new monero-wallet-cli in RPC mode, you can save
time and trouble by downloading the script below based on your computer's Operating System.

* [Windows](#) - Coming Soon
* [Linux and OS X](#) - Coming Soon

Once downloaded, copy the script to the location you installed monero-wallet-cli.

On **Windows**, you can simply double click the script and it will run. Feel free to make a
shortcut to it on your desktop or elsewhere.

On **Linux** or **OS X**, open a terminal and navigate to where you saved the script. Then
run `./run_monero-wallet-cli.sh` and follow the instructions.


# Configure monero-wallet-cli yourself

This guide will walk through every step needed to setup monero-wallet-cli in RPC mode yourself.
It is intended for users that do not want to use our pre-configured scripts or those that
want to learn how to write their own script.

## Opening monero-wallet-cli for the first time

Getting started is pretty much as simple as typing "monero-wallet-cli" - no wonder it's called that!

1. Open the command line:

   **Windows**: Open "Command Prompt"

   **OS X**: Open "Terminal"

   **Linux**: Varies by distro, but I'm guessing you know how!

2. Navigate to where you saved the official release:

   In Windows, type something like `cd C:\Programs\monero-release\`, specifying the path to
   where you installed monero-wallet-cli.

   In the OS X or Linux, type `cd /path/to/where/you/installed/the/release/`

3. Open monero-wallet-cli:

   If you want to connect to a monero daemon node on the same machine as your wallet, this is
   as easy as typing `monero-wallet-cli.exe` on Windows or `./monero-wallet-cli` on OS X and Linux.

   If you do not want to run a daemon node, you can connect to publicly available nodes by
   typing `./monero-wallet-cli --daemon-address <address>:<port>`. For example,

       ./monero-wallet-cli --daemon-address node.moneroclub.com:8880

   (Use `monero-wallet-cli.exe` if on Windows.)

   You will be prompted for a name for your wallet. Choose whatever you like. For the
   remainder of this tutorial, we will use the wallet name `ChromeWallet`. Then choose a
   password (this will encrypt your wallet keys when your wallet is not open). We'll use `xxxx`.

   At this point, your wallet will open and display a number of things, including your wallet's
   address and its secret recovery seed. You probably want to write down your seed in a
   secure place. However, if you forget or do not want to at this time, the wallet extension
   gives you the opportunity to see your seed later in the browser.

   Finally, type `refresh` and then `exit`. Your wallet has been generated and saved, and
   you're ready for the last step!


## Running monero-wallet-cli in JSON RPC mode

To open your wallet in Linux/OS X, you'll use the command:

    ./monero-wallet-cli --wallet-file ChromeWallet --password xxxx --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082

Note the extra commands `--rpc-bind-ip 127.0.0.1` and `--rpc-bind-port`. This is what lets
the Chrome extension talk to monero-wallet-cli. You can choose any port you wish, but 18082 is a
good choice if you are unsure. When you open the Chrome extension for the first time, you
will be taken to a configuration page where you will tell the extension what port you chose.

If you want to connect to a remote node, you add the `--daemon-address` argument. For example:

    ./monero-wallet-cli --wallet-file ChromeWallet --password xxxx --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082 --daemon-address node.moneroclub.com:8880


## Running monero-wallet-cli headless in JSON RPC mode

If you are running the wallet in RPC mode, you probably don't want to have to leave your
command line open all the time. Depending on your system, one of these solutions might help
you keep your wallet offscreen.

### Windows:

Switch to Linux. J/K... For now, we recommend minimizing the command prompt that monero-wallet-cli
opens in. We are evaluating more robust options.

### OS X and Linux:

We recommend using `screen` to be able to run your wallet in the background.

    screen ./monero-wallet-cli --wallet-file ChromeWallet --password xxxx --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082

When you first do this, it will look like a normal command line window. However, if you type
`cntl`+`a`+`d`, it will detach to the background. To return to the screen later, type `screen -r`
in a terminal.


## Automating all the things

Now that you've walked through the monero-wallet-cli 101 tutorial, I'll leave you with this: how
to write a script that does all this stuff for you so that you don't have to remember it every time.

### OS X and Linux

I use shell scripts to simplify things. In the terminal, write `nano run_wallet_chrome.sh`.
The bit after `nano` will be the name of your script... feel free to use something else.
The nano text editor will open in your terminal. Write the following:

    #!/bin/sh
    PASS=$1
    screen ./monero-wallet-cli --wallet-file ChromeWallet --password ${PASS} --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082

Include `--daemon-address` if appropriate.

Then, save your script by typing `cntl`+`x` followed by `y`.

Finally, make your script executable: `chmod +x run_wallet_chrome.sh`.

Now whenever you want to run your wallet in rpc mode, you just type `./run_wallet_chrome.sh xxxx`.
Notice that your password should follow `run_wallet_chrome.sh`. This helps keep your wallet
somewhat protected by not including your password as clear text in the shell script itself.
As before, if you want it to run headless, just type `cntl`+`a` followed by `d`.

monero-wallet-cli should now run in the background on your computer until you either restart
your machine or close monero-wallet-cli (you can do this from the extension), at which point you
will need to start it again.

If you would like to make it so you can double-click your run script and it will automatically
execute in OS X, right click on it and select "Open With" > "Other". Find "Utilities" and choose "Terminal".
Select "Always Open With" and click "Open". In Linux, try these instructions:
[askubuntu.com](http://askubuntu.com/questions/465531/how-to-make-a-shell-file-execute-by-double-click).

### Windows

On Windows, we will write a "batfile" to do all of this for us.

Open a text editor, and copy your monero-wallet-cli command. Ex:

    set /p Input=Enter password:
    monero-wallet-cli.exe --wallet-file ChromeWallet --password "%Input%" --rpc-bind-ip 127.0.0.1 --rpc-bind-port 18082

Now save as a .bat file, ex: `run_wallet_chrome.bat`.
Make sure that you change File Type ".txt" to "All Files" so that your script saves properly.

You can run your script by simply double-clicking the file. I recommend making a shortcut
(available in menu by right clicking on the file) and move the shortcut someplace convenient,
like your desktop.
