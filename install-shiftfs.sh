#!/bin/sh
cd ~
git clone --branch=k5.10 git://github.com/toby63/shiftfs-dkms.git shiftfs-dkms
cd shiftfs-dkms
sudo make -f Makefile.dkms
sudo find /lib/modules/$(uname -r)/ -iname \"*shiftf*\"
sudo modprobe shiftfs
lsmod | grep shiftfs
echo \"shiftfs\" | sudo tee /etc/modules-load.d/shiftfs.conf