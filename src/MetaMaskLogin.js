import React from 'react';
import { ethers } from 'ethers';

const MetamaskLogin = ({ onLoginSuccess }) => {
    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log('MetaMask Here!');

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Connected', accounts[0]);
                if (onLoginSuccess) {
                    onLoginSuccess(accounts[0]);
                }
            } catch (error) {
                console.log('Error connecting to metamask', error);
            }
        } else {
            console.log('Need to install MetaMask');
        }
    };

    return (
        <button className="metamask-btn" onClick={connectWalletHandler}>
            Connect with MetaMask
        </button>
    );
};

export default MetamaskLogin;
