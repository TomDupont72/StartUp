import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { TezosContext } from '../TEZ/TezosContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const Refuse = () => {

    const { blockchain } = useContext(GlobalContext);

    const { Node, publicKey, refuse, storage, setChange, contractAddress, contractABI } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const [claimsTried, setClaimsTried] = useState([]);
    const [loadingTest, setLoadingTest] = useState(false);

    const navigate = useNavigate();

    const handleHome = () => {
        try {
            navigate('/Accueil');

        } catch (error) {
            console.log(error);
        }
    }

    const handleRefuse = async (claimTried) => {
        try {
            setLoadingTest(false);
            await refuse(claimTried[0]);

            setChange('handleRefuse');            
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
                    const map_claim2 = await storage.map_claims2.get(publicKey);
                    const newClaimsTried = [];

                    if (map_claim2 !== undefined) {
                        for (let i = 0; i < map_claim2.length; i++) {
                            const claim = await storage.claims.get({0: map_claim2[i], 1: publicKey});
                            newClaimsTried.push([map_claim2[i], claim]);
                        }
                        setClaimsTried(newClaimsTried);
                    }
                } else {
                    const contractETH = new Node.eth.Contract(contractABI, contractAddress);
                    const map_claim2Length = await contractETH.methods.longueur_map_claims2(publicKey).call();
                    if (map_claim2Length !== undefined) {
                        const newClaimsTried = [];
                        for (let i = 0; i < map_claim2Length; i++) {
                            const a = await contractETH.methods.map_claims2(publicKey, i).call();
                            const claim = await contractETH.methods.claims(a, publicKey).call();
                            const date = Number(claim)*1000;
                            newClaimsTried.push([a, date]);
                        }
                        setClaimsTried(newClaimsTried);
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
            <div className='cadre'>
                {claimsTried.map((claimTried, index) => 
                <div className='ligne' key={index}>
                    <div>
                        <h3 className='claim'>Address : {claimTried[0]}</h3>
                        <h3 className='claim'>Date : {new Date(claimTried[1]).toLocaleString()}</h3>
                    </div>
                    <input type='button' className='bouton' value='Refuse' onClick={() => handleRefuse(claimTried)}/>
                </div>)}
                <input type='button' className='bouton' value='Home' onClick={handleHome}/>
            </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} alt='Loading' className='loading'/>
        </div>}
        </div>
    );
}

export default Refuse;