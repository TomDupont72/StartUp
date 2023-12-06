import { useContext, useState, useEffect } from 'react';
import { TezosContext } from '../TEZ/TezosContext';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const Accueil = () => {

    const { blockchain } = useContext(GlobalContext);    

    const [fundsBack, setFundsBack] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const [contractPrice, setContractPrice] = useState('');
    const [contractDelay, setContractDelay] = useState('');
    const [specialClaimed, setSpecialClaimed] = useState([]);
    const [specialClaimedTest, setSpecialClaimedTest] = useState(false);
    const [securedTest, setSecuredTest] = useState(false);
    const [claimedTest, setClaimedTest] = useState(false);
    const [loadingTest, setLoadingTest] = useState(false);

    const navigate = useNavigate();

    const { Node, publicKey, balance, setBalance, disconnectWallet, getBackFunds, setChange, storage, contractAddress, contractABI } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const handleDisconnectWallet = async () => {
        try {
            await disconnectWallet();
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };

    const handleSecure = async () => {
        try {
            navigate('/Accueil/Secure');

        } catch (error) {
            console.log(error);
        }
    }

    const handleClaim = async () => {
        try {
            navigate('/Accueil/Claim');

        } catch (error) {
            console.log(error);
        }
    }

    const handleRefuse = async () => {
        try {
            navigate('/Accueil/Refuse');

        } catch (error) {
            console.log(error);
        }
    }   

    const handleSuperWallet = async () => {
        try {
            navigate('/Accueil/SuperWallet');

        } catch (error) {
            console.log(error);
        }
    }

    const handleNFT = async () => {
        try {
            navigate('/Accueil/NFT');

        } catch (error) {
            console.log(error);
        }
    }

    const handleGetBackFunds = async () => {
        try {
            setLoadingTest(false);
            await getBackFunds(fundsBack*1e6);
            
            setFundsBack('');
            if(blockchain === 'tez') {
                const utilisateur = await storage.utilisateurs.get(publicKey);

                setBalance(balance.toString());
                setContractBalance(utilisateur.solde*1e-6);
            }
            setChange('handleGetBackFunds');
        } catch (error) {
            console.log(error);
        }
    }

    window.addEventListener('beforeunload', function (e) {
        localStorage.setItem('change', 'refresh');
    });

    useEffect(() => {
        const getContractInfos = async () => {
            try{
                setChange(localStorage.getItem('change'));
                if (blockchain === 'tez') {
                    const utilisateur = await storage.utilisateurs.get(publicKey);
                    const map_special1 = await storage.map_specials1.get(publicKey);
                    const map_claim2 = await storage.map_claims2.get(publicKey);
                
                    const newSpecialClaimed = [];

                    if (utilisateur !== undefined) {
                        setSecuredTest(true);
                        setContractBalance(utilisateur.solde*1e-6);
                        setContractPrice(utilisateur.caution*1e-6);
                        setContractDelay(utilisateur.delai/60);
                    }

                    if(map_special1 !== undefined) {
                        for (let i = 0; i < map_special1.length; i++) {
                            const map_claim2 = await storage.map_claims2.get(map_special1[i]);
                            if (map_claim2 !== undefined) {
                                for (let j = 0; j < map_claim2.length; j++) {
                                    setSpecialClaimedTest(true);
                                    newSpecialClaimed.push([map_special1[i], map_claim2[j]]);
                                }
                            }
                        }
                        if (map_special1.length > 0) {
                            setSpecialClaimed(newSpecialClaimed);
                        }
                    }

                    if(map_claim2 !== undefined) {
                        if (map_claim2.length > 0){
                            setClaimedTest(true);
                        }
                    }
                } else {
                    const contractETH = new Node.eth.Contract(contractABI, contractAddress);
                    const map_claim2Length = await contractETH.methods.longueur_map_claims2(publicKey).call();

                    if (Number(map_claim2Length) !== 0) {
                        setClaimedTest(true);
                    }

                    const utilisateur = storage.utilisateurs;

                    setSecuredTest(false);

                    if (Node.utils.fromWei(utilisateur.solde, 'ether') > 0) {
                        setSecuredTest(true);
                        setContractBalance(Node.utils.fromWei(utilisateur.solde, 'ether'));
                        setContractPrice(Node.utils.fromWei(utilisateur.caution, 'ether')*1e-6);
                        setContractDelay(Node.utils.fromWei(utilisateur.delai, 'wei')/60);
                    }

                }

                localStorage.setItem('change', '');
                setLoadingTest(true);
            } catch (error) {
                console.log(error);
            }
        }
        getContractInfos();
    } ,[storage]);

    return (
        <div>
        { loadingTest ?
        <div className='tout'>
        <div className='ligne'>
            <div className='cadre'>
                <h1 id='TitreHomePage'>Wallet connected</h1>
                <div>
                    <h3>Address : {publicKey}</h3>
                    <h3>Balance : {balance} {blockchain === 'eth' ? 'Eth' : 'Tez'}</h3>
                </div>
                <div className='tel'>
                    <input type='button' className='bouton' value='Secure funds' onClick={handleSecure}/>
                    <input type='button' className='bouton' value='Claim a wallet' onClick={handleClaim}/>
                    <input type='button' className={ claimedTest ? 'boutonRouge' : 'bouton' } value='Refuse a claim' onClick={handleRefuse}/>
                    <input type='button' className='bouton' value='Super Wallet' onClick={handleSuperWallet}/>
                    <input type='button' className='bouton' value='NFT' onClick={handleNFT}/>
                </div>
                    <input type='button' className='bouton' value='Disconnect wallet' onClick={handleDisconnectWallet}/>
            </div>
                { securedTest ?
                <div className='cadre'>
                    <h1>Your smart contract informations</h1>
                    <h3>Secured funds : {contractBalance} {blockchain === 'eth' ? 'Eth' : 'Tez'}</h3>
                    <h3>Claim price : {contractPrice} {blockchain === 'eth' ? 'Eth' : 'Tez'}</h3>
                    <h3>Claim delay : {contractDelay} minutes</h3>
                    <input type='text' className='ecrire' placeholder='Enter an amount' value={fundsBack} onChange={ e => setFundsBack(e.target.value)}/>
                    <input type='button' className='bouton' value='Get back funds' onClick={handleGetBackFunds}/>
                </div> : null}
        </div>
        <div>
            { specialClaimedTest ? 
            <div className='cadre'>
            {specialClaimed.map((claim, index) => 
            <div className='ligne' key={index}>
              <h3 className='claim'>Address : {claim[0]}</h3>
              <h3 className='cote'>Claim address : {claim[1]}</h3>
            </div>)}
          </div> : null}
        </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} className='loading' alt='loading'/>
        </div> }
        </div>
    );

}

export default Accueil;