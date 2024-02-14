import React, { useEffect } from 'react'
import TextValueLoading from './TextValueLoading';

function WalletDisplay({ isMobile, accounts, ethBalance, semcoinBalance, handleDisconnect }) {

    let semcoinBalanceString = "";
    if (semcoinBalance === null || semcoinBalance.toString() === "") {
        semcoinBalanceString = <TextValueLoading />;
    } else {
        let splitString = semcoinBalance.toString().split(".");
        let pre = splitString[0];
        let post = splitString[1] ? splitString[1] : "";
        semcoinBalanceString = pre.toString() + (post !== "" ? "." + post.toString() : "");
    }

    let ethBalanceString = "";
    if (ethBalance === null || ethBalance.toString() === "") {
        ethBalanceString = <TextValueLoading />;
    } else {
        let splitString = ethBalance.toString().split(".");
        let pre = splitString[0];
        let post = splitString[1] ? splitString[1] : "";
        if (post !== "") {
            post = post.slice(0, 4);
        }
        ethBalanceString = pre.toString() + (post !== "" ? "." + post.toString() : "");
    }

    useEffect(() => {

    }, [accounts, ethBalance, semcoinBalance]);

    return (
        <>
            {isMobile && (
                <>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="navbar-nav w-100">
                            <div className="row w-100">

                                <div className="col-12 mt-2 h4"><i className="fa-solid fa-wallet"></i>{' '}...{accounts[0].slice(-6)}</div>
                                <div className="col-12 mt-2 h4">{ethBalanceString}{' '}<i className="fa-brands fa-ethereum"></i></div>
                                <div className="col-12 mt-2 h4">{semcoinBalanceString}{' '}<i className="fa-solid fa-coins"></i></div>
                                <div className="col-12 h4">
                                    <a className='nav-link' style={{ height: '80%' }} onClick={() => { handleDisconnect(); return false; }} href="/"><i className="fa-solid fa-plug-circle-xmark"></i> Disconnect</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!isMobile && (
                <>
                    <div className="collapse navbar-collapse" id="navbarRightContent">
                        <div className="navbar-nav ms-auto">
                            <div className='me-3'>
                                {/* Semcoin Tokens */}
                                <span className="nav-link">
                                    {semcoinBalanceString}{' '}<i className="fa-solid fa-coins"></i>
                                </span>
                            </div>

                            <div className='me-3'>
                                {/* Eth Tokens */}
                                <span className="nav-link">{ethBalanceString}{' '}<i className="fa-brands fa-ethereum"></i></span>
                            </div>

                            <div>
                                {/* Wallet Address */}
                                <span className="nav-link">
                                    <i className="fa-solid fa-wallet"></i>{' '}...{accounts[0].slice(-6)}
                                </span>
                            </div>

                            <div>
                                <a className='nav-link' style={{ height: '80%' }} onClick={() => { handleDisconnect(); return false; }} href="/"><i className="fa-solid fa-plug-circle-xmark"></i></a>
                            </div>
                        </div>
                    </div >
                </>
            )}
        </>
    )
}

export default WalletDisplay;