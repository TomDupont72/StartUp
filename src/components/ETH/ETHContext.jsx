import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

export const EthereumContext = createContext();

const EthereumProvider = ({ children }) => {


    const Node = new Web3(window.ethereum);
    const wallet = '';
    const [publicKey, setPublicKey] = useState('');
    const [balance, setBalance] = useState('');
    const contractAddress = '0x18EB36153Fe10AF2CD52e02F53A7780d534dccE9';
    const contractABI = [{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"claims","outputs":[{"internalType":"uint256","name":"moment","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"demande_1","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"demande_2","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"longueur_map_claims1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"longueur_map_claims2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"longueur_map_specials1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"longueur_map_specials2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"longueur_map_tokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"map_claims1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"map_claims2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"map_specials1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"map_specials2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"refuser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"s","type":"uint256"}],"name":"retirer_fonds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"retirer_special","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"c","type":"uint256"},{"internalType":"uint256","name":"d","type":"uint256"}],"name":"securiser","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"specials","outputs":[{"internalType":"uint256","name":"montant","type":"uint256"},{"internalType":"uint256","name":"delai_s","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"},{"internalType":"uint256","name":"m","type":"uint256"},{"internalType":"uint256","name":"d","type":"uint256"}],"name":"super_wallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens","outputs":[{"internalType":"uint256","name":"montant_t","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"utilisateurs","outputs":[{"internalType":"uint256","name":"solde","type":"uint256"},{"internalType":"uint256","name":"caution","type":"uint256"},{"internalType":"uint256","name":"delai","type":"uint256"}],"stateMutability":"view","type":"function"}];
    const contract = '';
    const [change, setChange] = useState('');
    const [storage, setStorage] = useState('');
    const [account, setAccount] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accountETH = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accountETH);
                setPublicKey(accountETH[0]);
                const balanceWei = await Node.eth.getBalance(accountETH[0]);
                setBalance(Node.utils.fromWei(balanceWei, 'ether'));
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            console.error('Ethereum provider not detected');
        }
    };

    const disconnectWallet = async () => {
        if (window.ethereum && window.ethereum.isConnected()) {
            try {
                await window.ethereum.request({ method: 'eth_accounts' });
            } catch (error) {
                console.error("Error disconnecting wallet:", error);
            }
        }
        setPublicKey('');
        setBalance('');
    };

    const secure = async (amount, price, claimDuration) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';

            const claimDurationMinute = claimDuration*60;

            const amountInETH = Node.utils.toWei(amount, 'ether');
            const priceInETH = Node.utils.toWei(price, 'ether');

            
            const tx = contractETH.methods.securiser(priceInETH, claimDurationMinute);
            const gas = await tx.estimateGas({ from: publicKey, value: amountInETH });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                value: amountInETH,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const claim = async (address, priceETH) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';

            const priceInETH = Node.utils.toWei(priceETH, 'ether')*1e-3;
            
            const tx = contractETH.methods.demande_1(address);
            const gas = await tx.estimateGas({ from: publicKey, value: priceInETH });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                value: priceInETH,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const refuse = async (address) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';
            
            const tx = contractETH.methods.refuser(address);
            const gas = await tx.estimateGas({ from: publicKey });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const claim2 = async (address) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';
            
            const tx = contractETH.methods.demande_2(address);
            const gas = await tx.estimateGas({ from: publicKey });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const superWallet = async (publicKeySpecial, amountSpecial, durationSpecial) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';
            
            const tx = contractETH.methods.super_wallet(publicKeySpecial, amountSpecial, durationSpecial);
            const gas = await tx.estimateGas({ from: publicKey });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSpecial = async (address) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';
            
            const tx = contractETH.methods.retirer_special(address);
            const gas = await tx.estimateGas({ from: publicKey });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const getBackFunds = async (fundsBack) => {
        try {
            await window.ethereum.enable();
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            contractETH.defaultChain = 'goerli';

            const fundsBackInETH = Node.utils.toWei(fundsBack*1e-6, 'ether')*1e-3;
            console.log(fundsBackInETH);
            
            const tx = contractETH.methods.retirer_fonds(fundsBackInETH);
            const gas = await tx.estimateGas({ from: publicKey });
            const gasPrice = await Node.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await Node.eth.getTransactionCount(publicKey);
            const txData = {
                from: publicKey,
                to: contractAddress,
                data,
                gas,
                gasPrice,
                nonce,
                chain : 'goerli'
            };  

            const receipt = await Node.eth.sendTransaction(txData);

            console.log('Operation successful');
        } catch (error) {
            console.log(error);
        }
    };

    const sendNFT = async () => {
        try {

        } catch (error) {
            console.log(error);
        }
    };

    const getBackNFT = async () => {
        try {

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
       const getContractInformations = async () => {
        if (change !== '') {
            const contractETH = new Node.eth.Contract(contractABI, contractAddress);
            const accountETH = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletPublicKey = accountETH[0];
            setPublicKey(walletPublicKey);

            const balanceWei = await Node.eth.getBalance(walletPublicKey);
            const newBalance = Node.utils.fromWei(balanceWei, 'ether');
            setBalance(newBalance);

            const utilisateur = await contractETH.methods.utilisateurs(walletPublicKey).call();
            
            setStorage({ utilisateurs: utilisateur });
        }
        
        }
        getContractInformations();
    }, [change]);

    return (
        <EthereumContext.Provider value={{ Node, wallet, publicKey, balance, setBalance, connectWallet, disconnectWallet, secure, claim, refuse, claim2, superWallet, deleteSpecial, getBackFunds, sendNFT, getBackNFT, contract, contractAddress, contractABI, setChange, storage }}>
            {children}
        </EthereumContext.Provider>
    );
};

export default EthereumProvider;