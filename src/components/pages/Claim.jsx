import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { TezosContext } from '../TEZ/TezosContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const Claim = () => {

    const { blockchain } = useContext(GlobalContext);

    const { Node, publicKey, claim, claim2, storage, setChange, contractAddress, contractABI } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const [claims, setClaims] = useState([]);
    const [publicKeyClaim, setPublicKeyClaim] = useState('');
    const [claimLength, setClaimLength] = useState(0);
    const [loadingTest, setLoadingTest] = useState(false);

    const Navigate = useNavigate();

    const handleHome = () => {
        try {
            Navigate('/Accueil');

        } catch (error) {
            console.log(error);
        }
    }

    const handleClaim = async () => {
        try {
            setLoadingTest(false);
            if (blockchain === 'tez') {
                var utilisateur = await storage.utilisateurs.get(publicKeyClaim);
                var caution = utilisateur.caution*1e-6;
            } else {
                const contractETH = new Node.eth.Contract(contractABI, contractAddress);
                var utilisateur = await contractETH.methods.utilisateurs(publicKeyClaim).call();
                var caution = Node.utils.fromWei(utilisateur.caution, 'ether')*1e-6;
                console.log(caution);
            }
            console.log(caution);
            await claim(publicKeyClaim, caution);
            setChange('handleClaim');
            setPublicKeyClaim('');
        } catch (error) {
            console.log(error);
        }
    }

    const handleClaim2 = async (claim) => {
        try {
            setLoadingTest(false);
            await claim2(claim[0]);
            setChange('handleClaim2');
        } catch (error) {
            console.log(error);
        }
    }

    window.addEventListener('beforeunload', function (e) {
        localStorage.setItem('change', 'refresh');
    });

    useEffect(() => {
        const getContractInfos = async () => {
            try {
                setChange(localStorage.getItem('change'));
                if (blockchain === 'tez') {
                    const map_claim1 = await storage.map_claims1.get(publicKey);
                    if(map_claim1 !== undefined) {
                        setClaimLength(map_claim1.length);
                        const new_claims = [];
                        for (let i = 0; i < map_claim1.length; i++) {
                            const claim = await storage.claims.get({0: publicKey, 1: map_claim1[i]});
                            new_claims.push([map_claim1[i], claim]);
                        }
                        setClaims(new_claims);
                    }
                } else {
                    const contractETH = new Node.eth.Contract(contractABI, contractAddress);
                    const map_claim1Length = await contractETH.methods.longueur_map_claims1(publicKey).call();
                    if(map_claim1Length != 0) {
                        setClaimLength(map_claim1Length);
                        const new_claims = [];
                        for (let i = 0; i < map_claim1Length; i++) {
                            const a = await contractETH.methods.map_claims1(publicKey, i).call();
                            const claim = await contractETH.methods.claims(publicKey, a).call();
                            const date = Number(claim)*1000;
                            new_claims.push([a, date]);
                        }
                        setClaims(new_claims);
                    }
                    
                }
                localStorage.setItem('change', '');
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
                        <input type='text' className='ecrire' placeholder='Enter a public key' onChange={e => setPublicKeyClaim(e.target.value)}/>
                        <input type='button' className='bouton' value='Claim' onClick={handleClaim}/>
                    </div>
                    <input type='button' className='bouton' value='Home' onClick={handleHome}/>
                </div>
                {claimLength > 0 ?
                <div className='cadre'>
                {claims.map((claim, index) => (
                <div className='ligne' key={index}>
                    <div>
                        <h3 className='claim'>Address : {claim[0]}</h3>
                        <h3 className='claim'>Date : {new Date(claim[1]).toLocaleString()}</h3>
                    </div>
                    <input type='button' className='bouton' value='Claim' onClick={() => handleClaim2(claim)} />
                </div>))}
            </div> : null}
            </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} className='loading' alt='loading'/>
        </div>}
        </div>
    );
}

export default Claim;