import React, { createContext, useState, useEffect } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

export const TezosContext = createContext();

const TezosProvider = ({ children }) => {

    const Node = new TezosToolkit('https://ghostnet.ecadinfra.com');
    const wallet = new BeaconWallet({ name: 'BackOnChain' });
    const [publicKey, setPublicKey] = useState('');
    const [balance, setBalance] = useState('');
    const [contract, setContract] = useState('');
    const [change, setChange] = useState('');
    const [storage, setStorage] = useState('');
    const contractABI = [];

    const contractAddress = 'KT1U1mJDP9dPEmc5uEAUBaCewEehHEeC5mQD';
    
    const connectWallet = async () => {
        try {
            Node.setWalletProvider(wallet);
            const network = { type: 'ghostnet', rpcUrl: 'https://ghostnet.ecadinfra.com' };
            await wallet.requestPermissions({ network });

            const walletPublicKey = await wallet.getPKH();
            setPublicKey(walletPublicKey);

            const balanceMutez = await Node.tz.getBalance(walletPublicKey);
            const balanceTez = balanceMutez.dividedBy(1_000_000);
            setBalance(balanceTez.toString());
        } catch (error) {
            console.log(error);
        }
    };

    const disconnectWallet = async () => {
        try {
            await wallet.client.clearActiveAccount();

            setPublicKey('');
            setBalance('');
        } catch (error) {
            console.log(error);
        }
    };    

    const secure = async (amountTz, priceTz, claimDuration) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const claimDurationMinute = claimDuration*60;

            const operation = await contract.methods.securiser(claimDurationMinute, priceTz).send({ amount: amountTz });
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const claim = async(address, priceTz) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.demande_1(address).send({ amount: priceTz });
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const refuse = async(address) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.refuser(address).send({});
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const claim2 = async(address) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.demande_2(address, []).send({});
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const superWallet = async(address, amount, duration) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.super_wallet(address, amount, duration).send({});
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const deleteSpecial = async(address) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.retirer_special(address).send({});
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const getBackFunds = async(amount) => {
        try {
            Node.setWalletProvider(wallet);
            const contract = await Node.wallet.at(contractAddress);

            const operation = await contract.methods.retirer_fonds(amount).send({});
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const sendNFT = async(NFTAddress, tokenId, amount) => {
        try {
            Node.setWalletProvider(wallet);

            const transferParameters = [
                {
                    from_: publicKey,
                    txs: [
                        {
                        to_: contractAddress,
                        token_id: tokenId,
                        amount: amount
                        }
                    ]
                }
            ];

            const contract = await Node.wallet.at(contractAddress);           
            const operation = await contract.methods.recevoir_NFT(NFTAddress, tokenId, amount, transferParameters).send();
            await operation.confirmation();

            console.log('Operation successful');
        } catch(error) {
            console.log(error);
        }
    };

    const getBackNFT = async(NFTAddress, tokenId, amount) => {
        try {
            Node.setWalletProvider(wallet);

            const transferParameters = [
                {
                    from_: contractAddress,
                    txs: [
                        {
                        to_: publicKey,
                        token_id: tokenId,
                        amount: amount
                        }
                    ]
                }
            ];

            const contract = await Node.wallet.at(contractAddress);           
            const operation = await contract.methods.retirer_NFT(NFTAddress, tokenId, transferParameters).send();
            await operation.confirmation();

        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getContractInformations = async () => {
            try {
                if (change !== '') {
                    Node.setWalletProvider(wallet);
                    const walletPublicKey = await wallet.getPKH();
                    setPublicKey(walletPublicKey);

                    const balanceMutez = await Node.tz.getBalance(walletPublicKey);
                    const balanceTez = balanceMutez.dividedBy(1_000_000);
                    setBalance(balanceTez.toString());

                    const newContract = await Node.wallet.at(contractAddress);
                    setContract(newContract);
                    const newStorage = await newContract.storage();
                    setStorage(newStorage);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getContractInformations();
    }, [change]);

    return (
        <TezosContext.Provider value={{ Node, wallet, publicKey, balance, setBalance, connectWallet, disconnectWallet, secure, claim, refuse, claim2, superWallet, deleteSpecial, getBackFunds, sendNFT, getBackNFT, contract, contractAddress, contractABI, setChange, storage }}>
            {children}
        </TezosContext.Provider>
    );
};

export default TezosProvider;
