import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { TezosContext } from '../TEZ/TezosContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const Secure = () => {

    const { blockchain } = useContext(GlobalContext);

    const { publicKey, getBackNFT, sendNFT, storage, setChange } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const [NFT, setNFT] = useState([]);
    const [NFTAddress, setNFTAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [amount, setAmount] = useState('');
    const [loadingTest, setLoadingTest] = useState(false);
    const [NFTLength, setNFTLength] = useState(0);

    const navigate = useNavigate();

    const handleHome = () => {
        try {
            navigate('/Accueil');
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendNFT = async () => {
        try {
            setLoadingTest(false);
            await sendNFT(NFTAddress, tokenId, amount);

            setChange('handleSendNFT');
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetBackNFT = async (address, id, amount) => {
        try {
            setLoadingTest(false);
            await getBackNFT(address, id, amount);

            setChange('handleGetBackNFT');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getContractInfos = async () => {
            try{
                const map_token = await storage.map_tokens.get(publicKey);
                if (map_token !== undefined) {
                    setNFTLength(map_token.length);
                    const newNFT = [];
                    for (let i=0; i<map_token.length; i++) {
                        const token = await storage.tokens.get({0: publicKey, 1: map_token[i].adresse, 2: map_token[i].id*1});
                        newNFT.push([map_token[i].adresse, map_token[i].id, token]);
                    }
                    setNFT(newNFT);
                }
                setChange(localStorage.getItem('change'));
                setLoadingTest(true);
            } catch (error) {
                console.log(error);
            }
        }
        getContractInfos();
    }, [storage]);

    return (
        <div>
        { loadingTest ?
        <div className='tout'>
        <div className='ligne'>
            <div className='cadre'>
                <div className='ligne'>
                    <input type='text' className='ecrire' placeholder='NFT address' onChange={e => setNFTAddress(e.target.value)}/>
                    <input type='text' className='ecrire' placeholder='Token ID' onChange={e => setTokenId(e.target.value)}/>
                    <input type='text' className='ecrire' placeholder='Amount' onChange={e => setAmount(e.target.value)}/>
                    <input type='button' className='bouton'value='Send' onClick={handleSendNFT}/>
                </div>
                <input type='button' className='bouton' value='Home' onClick={handleHome}/>
            </div>
            <div className='cadre'>
                {NFT.map((n, index) => 
                <div className='ligne' key={index}>
                    <div>
                        <h3 className='claim'>Address : {n[0]}</h3>
                        <h3 className='claim'>ID : {n[1]*1e-6}</h3>
                        <h3 className='claim'>Amount : {n[2]*1e-6}</h3>
                    </div>
                    <input type='button' className='bouton' value='Get back' onClick={() => handleGetBackNFT(n[0], n[1], n[2])}/>
                </div>)}
            </div>
        </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} alt='Loading...' className='loading'/>
        </div>}
        </div>
    );
}

export default Secure;