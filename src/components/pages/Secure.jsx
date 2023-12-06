import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { TezosContext } from '../TEZ/TezosContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const Secure = () => {

    const { blockchain } = useContext(GlobalContext);

    const { secure, setChange } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const [amountTz, setAmountTz] = useState('');
    const [priceTz, setPriceTz] = useState('');
    const [claimDuration, setClaimDuration] = useState('');
    const [loadingTest, setLoadingTest] = useState(false);

    const navigate = useNavigate();

    const handleSecure = async () => {
        try {
            setLoadingTest(false);
            await secure(amountTz, priceTz*1000000, claimDuration);
            setChange('handleSecure');
            navigate('/Accueil');

            setAmountTz('');
            setPriceTz('');
            setClaimDuration('');
        } catch (error) {
            console.log(error);
        }
    }

    const handleHome = () => {
        try {
            navigate('/Accueil');
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const getContractInformations = async () => {
            try {
                setLoadingTest(true);
            } catch (error) {
                console.log(error);
            }
        }
        getContractInformations();
    }, []);

    return (
        <div>
        { loadingTest ?
        <div className='tout'>
            <div className='cadre'>
                <div>
                    <input type='number' placeholder='Enter an amount' className='ecrire' onChange={e => setAmountTz(e.target.value)}/>
                    <input type='number' placeholder='Enter a deposit' className='ecrire' onChange={e => setPriceTz(e.target.value)}/>
                    <input type='number' placeholder='Enter a delay' className='ecrire' onChange={e => setClaimDuration(e.target.value)}/>
                    <input type='button' className='bouton' value='Secure' onClick={handleSecure}/>
                </div>
                <input type='button' className='bouton' value='Home' onClick={handleHome}/>
            </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} alt='Loading...' className='loading'/>
        </div> }
        </div>
    );
}

export default Secure;