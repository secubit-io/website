// Get user's approval for transaction
const approvalResult = await approver.approveSend(
    from, to, amount, coin, feeTier, network, userPubkey
);

// Sign transaction in HSM and broadcast it
const resp = await fetch(
    `/wallets/${walletId}/${network}/transactions`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
    },
    body: JSON.stringify({
        approval_data: approvalResult.approvalData,
        approvals: [approvalResult.approval]
    }),
});

// Get transaction id
const { tx_hash } = await resp.json();