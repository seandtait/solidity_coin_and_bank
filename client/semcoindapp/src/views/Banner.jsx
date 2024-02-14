import React, { useEffect, useState } from 'react'

function Banner({ isMobile, web3, handleWithdrawFeePot, ethPoolBalance, feePotBalance }) {

    const [colSize, setColSize] = useState(4);

    useEffect(() => {

        setColSize(isMobile ? "12" : "4");

    }, [ethPoolBalance, feePotBalance, isMobile]);

    return (
        <div className="row" style={{ marginTop: '2rem', border: '1px solid black', borderRadius: '8px' }}>

            <div className={`col-${colSize} h-100`}>
                {/* Eth Pool */}
                <div className="d-flex flex-column align-items-stretch h-50 m-3">
                    {ethPoolBalance && (
                        <h4 className='p-4'>Eth Pool (<i className="fa-brands fa-ethereum"></i>) <br /> {Number(web3.utils.fromWei(ethPoolBalance, "ether"))}</h4>
                    )}
                </div>
            </div>
            <div className="col-4">

            </div>
            <div className={`col-${colSize} h-100`}>
                <div className=" h-100">
                    {/* Fee Pot */}
                    <div className="d-flex flex-column h-50 m-3">
                        {feePotBalance && (
                            <>
                                <h4 className='p-4'>Fee Pot (<i className="fa-brands fa-ethereum"></i>) <br /> {Number(web3.utils.fromWei(feePotBalance, "ether"))}</h4>
                                <button onClick={() => handleWithdrawFeePot(feePotBalance)} className="btn btn-semcoin-dark my-1 flex-grow-1">Withdraw {Number(web3.utils.fromWei(feePotBalance, "ether"))}{' '}<i className="fa-brands fa-ethereum"></i></button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Banner;