$(async function () {
  // Bind Dom init Event
  bindErrorModalCloseEvent()

  const detectProvider = detectPocketType()

  if (
    detectProvider &&
    ['imtoken', 'metamask'].includes(detectProvider.pocketType)
  ) {
    fillEnvPocketIcon(detectProvider.pocketType)
    //Bind Button ImToken .metamask
    bindConnectEvent(detectProvider.pocketType)
    bindGetBalanceEvent(detectProvider.pocketType)

    await initDappState()
  } else {
    $('a.card-footer-item').off('click')
  }
})

/* ++++++++++++++++++++++++++++++++++++++++++ DApp Function ++++++++++++++++++++++++++++++++++++++++++++++++ */
function bindConnectEvent(pocketType) {
  $('#connectBtn').on('click', async function (e) {
    const id = e.target.id

    const chainid = await connectEthereum()
    const chainNetwork = getChainNetwork(chainid)
    if (chainNetwork) {
      fillChainNetwork(chainNetwork.chainText)

      // selectedAddress
      const selectedAddress = await getSelectedAddress()
      fillSelectedAddress(selectedAddress)

      // balance
      await getBalanceDomHandler(selectedAddress)
    }
  })
}

function bindGetBalanceEvent(pocketType) {
  $('#getBalanceBtn').on('click', async function (e) {
    const chainid = await connectEthereum()
    const chainNetwork = getChainNetwork(chainid)
    if (chainNetwork) {
      fillChainNetwork(chainNetwork.chainText)

      // selectedAddress
      const selectedAddress = await getSelectedAddress()
      fillSelectedAddress(selectedAddress)

      // balance
      await getBalanceDomHandler(selectedAddress)
    }
  })
}

function bindErrorModalCloseEvent() {
  $('#errorModalCloseBtn').on('click', function (e) {
    $('#errorModal').removeClass('is-active')
  })
}

function detectPocketType() {
  let dappPocketEnv = null
  if (!!window.imToken || (window.ethereum && window.ethereum.isImToken)) {
    window._dappPocketEnv_ = dappPocketEnv = {
      pocketType: 'imtoken',
      name: 'imToken',
    }
    return dappPocketEnv
  }
  if (!!window.ethereum && window.ethereum.isMetaMask) {
    window._dappPocketEnv_ = dappPocketEnv = {
      pocketType: 'metamask',
      name: 'MetaMask',
    }
    return dappPocketEnv
  }

  return null
}

function getWeb3js() {
  if (
    !window.ethereum ||
    !window._dappPocketEnv_ ||
    !['imtoken', 'metamask'].includes(window._dappPocketEnv_.pocketType)
  ) {
    throw new Error('The DApp only support Metamask & Imtoken')
  }

  return !!window.web3js
    ? window.web3js
    : ((window.web3js = new Web3(window.ethereum)), window.web3js)
}

async function connectEthereum() {
  if (!window.ethereum) {
    throw new Error('No Ethereum in Enviroment.')
  }
  try {
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    return chainId
  } catch (e) {
    let errorTitle = 'Connect Wallet Fail.'
    if (e.code) {
      errorTitle += '[' + e.code + ']'
      showErrorModal(e.message || e, errorTitle)
    }
    console.debug(e)
  }
}

async function initDappState() {
  try {
    const chainid = await connectEthereum()
    const chainNetwork = getChainNetwork(chainid)
    if (chainNetwork) {
      fillChainNetwork(chainNetwork.chainText)

      // selectedAddress
      const selectedAddress = await getSelectedAddress()
      fillSelectedAddress(selectedAddress)

      // balance
      await getBalanceDomHandler(selectedAddress)
    }
  } catch (err) {
    showErrorModal(err.message || err.toString(), 'DApp initailized fail.')
    console.error(err)
  }
}

/**
 *
 * @param {string} address
 */
async function getETHBalance(address) {
  if (!window.ethereum) {
    throw new Error('No Ethereum in Enviroment.')
  }

  const web3Inst = getWeb3js()
  const balance = await web3Inst.eth.getBalance(address)

  return balance
}

async function getSelectedAddress() {
  if (!window.ethereum) {
    throw new Error('No Ethereum in Enviroment.')
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' })
  return accounts && accounts.length ? accounts[0] : ''
}

function handleWei(wei) {
  if (typeof wei === 'undefined') return '--'
  let balNum = null
  if (typeof wei === 'string') {
    balNum = Web3.utils.fromWei(wei, 'Ether')
  } else if (typeof wei === 'number') {
    balNum = Web3.utils.fromWei(wei.toString(), 'Ether')
  }

  return new Number(balNum).toFixed(4)
}

async function getBalanceDomHandler(address) {
  const balwei = await getETHBalance(address)
  const balEtherVal = handleWei(balwei)
  fillWalletBalance(balEtherVal)
  return balwei
}

/* ========================================== DOM Handler Methods ========================================== */
function fillEnvPocketIcon(type) {
  const pocketIconCtx = document.querySelector('#pocketIconContainer')
  //remove
  pocketIconCtx.innerHTML = ''
  switch (type) {
    case 'metamask':
      const mmImg = document.createElement('img')
      mmImg.src = 'assets/icon/metamask.png'
      mmImg.className = 'pocket-icon'
      mmImg.alt = 'MetaMask'
      pocketIconCtx.appendChild(mmImg)
      break
    case 'imtoken':
      const imImg = document.createElement('img')
      imImg.src = 'assets/icon/imtoken.png'
      imImg.className = 'pocket-icon'
      imImg.alt = 'ImToken'
      pocketIconCtx.appendChild(imImg)
      break
    default:
      //remove
      break
  }
}

function fillChainNetwork(chainName) {
  document.querySelector('#currentChainName').innerText = chainName || '--'
}

function fillSelectedAddress(address) {
  document.querySelector('#selectedAddress').innerText = address || '--'
}

function fillWalletBalance(balanceValt) {
  document.querySelector('#tokenBalance').innerText = balanceValt || '--'
}

function showErrorModal(errMsg, errTitle = 'Error') {
  $('#errorModal').addClass('is-active')

  $('#errorMessage').innerText =
    typeof errMsg === 'string'
      ? errMsg
      : typeof errMsg.toString === 'function'
      ? errMsg.toString()
      : '' + errMsg

  $('#errorTitle').innerText = errMsg
}
