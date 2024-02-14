import React, { useEffect, useState } from 'react';

import semcoinLogo from '../../src/images/s-coin.png';

function Banking({ isMobile, handleDepositEth, handleWithdrawEth, semcoinBalance, ethBalance }) {

    const [withdrawTokens, setWithdrawTokens] = useState(0);
    const [ethBalanceString, setEthBalanceString] = useState("");
    const [semcoinBalanceString, setSemcoinBalanceString] = useState("");

    const [colSize, setColSize] = useState(4);

    const handleSliderChange = (event) => {
        setWithdrawTokens(event.target.value);
    };

    const preHandleWithdrawEth = () => {
        setWithdrawTokens(0);
        handleWithdrawEth(withdrawTokens);
    }



    useEffect(() => {

        getEthBalanceString();

        setColSize(isMobile ? "12" : "4");

        function getEthBalanceString() {
            let ethBalanceString = "";
            if (ethBalance === null || ethBalance.toString() === "") {
                setEthBalanceString("");
            } else {
                let splitString = ethBalance.toString().split(".");
                let pre = splitString[0];
                let post = splitString[1] ? splitString[1] : "";
                if (post !== "") {
                    post = post.slice(0, 4);
                }
                ethBalanceString = pre.toString() + (post !== "" ? "." + post.toString() : "");
                setEthBalanceString(ethBalanceString);
            }
        }

        getSemcoinBalanceString();

        function getSemcoinBalanceString() {
            let semcoinBalanceString = "";
            if (semcoinBalance === null || semcoinBalance.toString() === "") {
                setSemcoinBalanceString("");
            } else {
                let splitString = semcoinBalance.toString().split(".");
                let pre = splitString[0];
                let post = splitString[1] ? splitString[1] : "";
                semcoinBalanceString = pre.toString() + (post !== "" ? "." + post.toString() : "");
                setSemcoinBalanceString(semcoinBalanceString);
            }
        }

    }, [withdrawTokens, ethBalance, semcoinBalance, isMobile]);

    return (
        <>
            <div className="row" style={{ marginTop: '0rem' }}>
                <div className="d-flex flex-column flex-lg-row">
                    <div className={`col-${colSize} order-lg-1 order-md-2 order-sm-2 order-2 mt-5`}>
                        <div className="card h-100" style={{ backgroundColor: '#3f403c' }}>
                            {/* DEPOSIT */}
                            <div className="d-flex flex-column align-items-stretch h-100 m-3 banking-card">
                                <h3 className='m-3'>DEPOSIT</h3>
                                {isMobile && ethBalanceString && (
                                    <p className='h4 mb-4'>{ethBalanceString}{' '}<i className="fa-brands fa-ethereum"></i></p>
                                )}
                                <button disabled={Number(ethBalance) < 0.01} onClick={() => handleDepositEth(0.01)} className="btn btn-semcoin my-1 flex-grow-1">Deposit 0.01{' '}<i className="fa-brands fa-ethereum"></i></button>
                                <button disabled={Number(ethBalance) < 0.1} onClick={() => handleDepositEth(0.1)} className="btn btn-semcoin my-1 flex-grow-1">Deposit 0.1{' '}<i className="fa-brands fa-ethereum"></i></button>
                                <button disabled={Number(ethBalance) < 1} onClick={() => handleDepositEth(1)} className="btn btn-semcoin my-1 flex-grow-1">Deposit 1{' '}<i className="fa-brands fa-ethereum"></i></button>
                                <button disabled={Number(ethBalance) < 10} onClick={() => handleDepositEth(10)} className="btn btn-semcoin my-1 flex-grow-1">Deposit 10{' '}<i className="fa-brands fa-ethereum"></i></button>
                                <button disabled={Number(ethBalance) < 100} onClick={() => handleDepositEth(100)} className="btn btn-semcoin my-1 flex-grow-1">Deposit 100{' '}<i className="fa-brands fa-ethereum"></i></button>
                            </div>
                        </div>
                    </div>
                    {isMobile && (
                        <div className="mt-4 col-12 order-1 order-sm-1 order-md-1 order-lg-1">
                            <img src={semcoinLogo} width={'40%'} className="img-fluid m-auto" alt="Token Logo"></img>
                        </div>
                    )}
                    {!isMobile && (
                        <div style={{ marginTop: '75px' }} className="col-4 order-2 order-lg-2 order-md-2 mt-5 m-auto">
                            <img src={semcoinLogo} width={'75%'} className="img-fluid" alt="Token Logo"></img>
                        </div>
                    )}

                    <div className={`col-${colSize} order-3 order-md-3 mt-5`}>
                        <div className="card h-100" style={{ backgroundColor: '#3f403c' }}>
                            {/* Withdraw */}
                            < div className="d-flex flex-column align-items-stretch h-100 m-3 banking-card">
                                <h3 className='m-3'>WITHDRAW</h3>
                                {semcoinBalance && (
                                    <>
                                        {isMobile && semcoinBalance && (
                                            <p className='h4'>{semcoinBalanceString}{' '}<i className="fa-solid fa-coins"></i></p>
                                        )}
                                        <span className='flex-grow-1'>{' '}</span>
                                        <input
                                            className="withdraw-slider"
                                            type="range"
                                            min="0"
                                            max={semcoinBalance.toString()}
                                            value={withdrawTokens}
                                            onChange={handleSliderChange}
                                        />

                                        <button disabled={withdrawTokens.toString() === "0"} onClick={() => preHandleWithdrawEth()} className="btn btn-semcoin my-1 flex-grow-1">Withdraw {withdrawTokens / 10000} {' '}<i className="fa-brands fa-ethereum"></i> <br /> {'('}{withdrawTokens} {' '}<i className="fa-solid fa-coins"></i>{')'}</button>
                                        <span className='flex-grow-1'>{' '}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Banking;