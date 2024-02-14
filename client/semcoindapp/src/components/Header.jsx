import React, { useEffect } from 'react'
import MetamaskConnect from './MetamaskConnect';
import WalletDisplay from './WalletDisplay';

import semcoinLogo from '../../src/images/s-coin.png';

function Header({ isMobile, accounts, ethBalance, semcoinBalance, handleConnectWallet, handleDisconnect }) {

	useEffect(() => {

	}, [accounts]);

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container">
					<div className='' style={{ width: '150px' }}>
						<img className="me-2" src={semcoinLogo} width={'20%'} alt="Token Logo" /><a className="navbar-brand" href="/">Semcoin</a>

					</div>
					{(!accounts || accounts.length === 0) && <MetamaskConnect isMobile={isMobile} handleConnectWallet={handleConnectWallet} />}
					{accounts && accounts.length > 0 && <WalletDisplay isMobile={isMobile} accounts={accounts} ethBalance={ethBalance} semcoinBalance={semcoinBalance} handleDisconnect={handleDisconnect} />}
				</div>
			</nav>
		</>
	)
}

export default Header;