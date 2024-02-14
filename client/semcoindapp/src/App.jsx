import { useEffect, useState } from 'react';
import './App.css';

import Web3 from 'web3';

// Components
import Header from './components/Header';
import Banner from './views/Banner';
import Banking from './views/Banking';
import Footer from './components/Footer';

// Contracts
import SemcoinContractABI from './contracts/Semcoin.json';
import SembankContractABI from './contracts/Sembank.json';

function App() {
	// Contract Addresses
	const semcoinContractAddress = '0x26Bd64ee209ef407AFE0333095c4d51e2CF25810';
	const sembankContractAddress = '0x8dD0B28Fbc513fdC4c2214Bcb6f8E8542710308c';

	const [web3, setWeb3] = useState(null);
	const [accounts, setAccounts] = useState(null);
	const [semcoinBalance, setSemcoinBalance] = useState(0);
	const [ethBalance, setEthBalance] = useState(0);

	const [isOwner, setIsOwner] = useState(false);
	const [ethPoolBalance, setEthPoolBalance] = useState(null);
	const [feePotBalance, setFeePotBalance] = useState(null);

	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const onAccountsChanged = async (_accounts) => {
		if (_accounts.length === 0) {
			// Connect to metamask

		} else {
			setAccounts(_accounts);
		}
	};

	const onConnectWallet = async () => {
		if (window.ethereum) {
			try {
				const _accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});
				const _web3 = new Web3(window.ethereum);
				const sembankContract = new _web3.eth.Contract(SembankContractABI.abi, sembankContractAddress);
				setIsOwner(await sembankContract.methods.isOwner().call({
					from: _accounts[0],
				}));
				setWeb3(_web3);
				onAccountsChanged(_accounts);
			} catch (error) {
				console.error(error);
			}
		} else {
			// Please install metamask

		}
	};

	const onDisconnect = () => {
		setAccounts(null);
	};

	const onDepositEth = async (ethAmount) => {
		try {
			const sembankContract = new web3.eth.Contract(SembankContractABI.abi, sembankContractAddress);
			const weiValue = web3.utils.toWei(ethAmount, "ether");
			await sembankContract.methods.deposit().send({
				from: accounts[0],
				value: weiValue,
			});

			await updateBalances();
			await updateIsOwner();

		} catch (error) {
			console.error(error);
		}
	}

	const onWithdrawEth = async (tokenAmount) => {
		try {
			if (tokenAmount === 0) return;

			const sembankContract = new web3.eth.Contract(SembankContractABI.abi, sembankContractAddress);
			const semcoinContract = new web3.eth.Contract(SemcoinContractABI.abi, semcoinContractAddress);

			await semcoinContract.methods.approve(sembankContractAddress, tokenAmount).send({
				from: accounts[0],
			});

			await sembankContract.methods.withdraw(Number(tokenAmount)).send({
				from: accounts[0],
			});

			await updateBalances();
			await updateIsOwner();

		} catch (error) {
			console.error(error);
		}
	}

	const onWithdrawFeePot = async (ethAmount) => {
		try {
			const sembankContract = new web3.eth.Contract(SembankContractABI.abi, sembankContractAddress);

			await sembankContract.methods.withdrawFeePot().send({
				from: accounts[0],
			});

			await updateBalances();
			await updateIsOwner();

		} catch (error) {
			console.error(error);
		}
	}

	async function updateBalances() {
		setEthBalance(null);
		setSemcoinBalance(null);
		if (accounts && accounts.length > 0 && web3) {
			// Get eth
			const eth = await web3.eth.getBalance(accounts[0]);
			setEthBalance(web3.utils.fromWei(eth, "ether"));

			// Get semcoin tokens
			const semcoinContract = new web3.eth.Contract(SemcoinContractABI.abi, semcoinContractAddress);
			const semcoin = await semcoinContract.methods.balanceOf(accounts[0]).call();
			setSemcoinBalance(semcoin);
		}
	}

	async function updateIsOwner() {
		const sembankContract = new web3.eth.Contract(SembankContractABI.abi, sembankContractAddress);
		setIsOwner(await sembankContract.methods.isOwner().call({
			from: accounts[0],
		}));

		if (isOwner) {
			// Fetch eth pool and fee pot balances
			const ethPool = await sembankContract.methods.ethPool().call({
				from: accounts[0],
			});
			setEthPoolBalance(ethPool.toString());
			const feePot = await sembankContract.methods.feePot().call({
				from: accounts[0],
			});
			setFeePotBalance(feePot.toString());
		} else {
			setEthPoolBalance(null);
			setFeePotBalance(null);
		}
	}

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', onAccountsChanged);
		}

		updateBalances();

		if (web3 && accounts) {
			updateIsOwner();
		} else {
			setIsOwner(false);
		}

		function handleResize() {
			setIsMobile(window.innerWidth < 990);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			if (window.ethereum) {
				window.ethereum.removeListener('accountsChanged', onAccountsChanged);
			}
			window.removeEventListener('resize', handleResize);
		}
	}, [accounts, web3, isOwner]);

	return (
		<div className="App">
			<div className='vh-100 d-flex flex-column'>


				<Header isMobile={isMobile} accounts={accounts} ethBalance={ethBalance} semcoinBalance={semcoinBalance} handleConnectWallet={onConnectWallet} handleDisconnect={onDisconnect} />

				<div className="h-100 container d-flex flex-column">
					{(accounts && accounts.length > 0) && <Banking isMobile={isMobile} handleDepositEth={onDepositEth} handleWithdrawEth={onWithdrawEth} semcoinBalance={semcoinBalance} ethBalance={ethBalance} />}
					<div className='flex-grow-1'>{' '}</div>
					{isOwner && <Banner isMobile={isMobile} web3={web3} handleWithdrawFeePot={onWithdrawFeePot} ethPoolBalance={ethPoolBalance} feePotBalance={feePotBalance} />}
					<Footer />
				</div>
			</div>
		</div>
	);
}

export default App;
