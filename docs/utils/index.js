const SupportNetWorks = [
  {
    chainName: 'mainnet',
    chainid: 0x1,
    chainText: 'Ethereum Main Network',
    uuid: 0x1,
    disabled: false,
  },
  {
    chainName: 'ropsten',
    chainid: 0x3,
    chainText: 'Ropsten Test Network',
    uuid: 3,
    disabled: false,
  },
  {
    chainName: 'rinkeby',
    chainid: 0x4,
    chainText: 'Rinkeby Test Network',
    uuid: 4,
    disabled: false,
  },
  {
    chainName: 'goerli',
    chainid: 0x5,
    chainText: 'Goerli Test Network',
    uuid: 5,
    disabled: false,
  },
  {
    chainName: 'kovan',
    chainid: 0x2a,
    chainText: 'Kovan Test Network',
    uuid: 42,
    disabled: false,
  },
]

function detectPocketType() {
  if (!!window.imToken || (window.ethereum && window.ethereum.isImToken)) {
    return {
      pocketType: 'imtoken',
      name: 'imToken',
    }
  }
  if (!!window.ethereum && window.ethereum.isMetaMask) {
    return {
      pocketType: 'metamask',
      name: 'MetaMask',
    }
  }

  return null
}

function getChainNetwork(chainid) {
  if (chainid === undefined || chainid === '') return ''
  const nw = SupportNetWorks.filter(function (n) {
    return !n.disabled
  }).find(function (n) {
    return n.chainid === parseInt(chainid) ? n : null
  })

  return nw
}
