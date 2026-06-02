---
title: "Why Secubit Beats Privy, Dfns, and Fireblocks for Institutional Wallet Security"
date: 2026-06-01
tag: Comparison
read_time: 8 min read
author: Secubit Team
excerpt: "Wallet infrastructure is often discussed as if every provider does the same thing. We compare Secubit, Privy, Dfns, and Fireblocks on the question that determines security and fit: where do the keys live, and what controls a signature?"
featured: true
---

The biggest losses in digital assets don't come from broken cryptography. They come from the **approval layer** — an attacker manipulating what a server hands to the signer, so a perfectly valid signature authorizes a malicious transfer. Hack the server, and the money's gone.

That single fact explains why so much wallet infrastructure is weaker than it looks. Most providers keep the trust-critical work — approval checks, policy engine, and transaction assembly — **outside** the secure hardware, in servers, clouds, or general-purpose enclaves. Secubit was built to close exactly that gap: the wallet and policy logic runs **inside** a FIPS-certified HSM, so compromising everything around it doesn't drain the wallet.

Here's how Secubit compares to three popular alternatives — and why, for institutions, it wins. Every claim about another provider is footnoted to a public source so you can verify it yourself.

## At a glance

| | **Privy** | **Dfns** | **Fireblocks** | **Secubit** |
|---|---|---|---|---|
| **Trust boundary** | A general-purpose cloud enclave [1][2] | Software around the HSM / MPC nodes [6] | Software MPC in cloud SGX enclaves [8] | **Inside a FIPS-certified HSM** |
| **Where the key lives** | Reassembled in a cloud TEE at signing [1] | MPC shares, or the whole key wrapped in an HSM used only as a vault [5][6] | MPC shares across SGX enclaves in multiple clouds — not in an HSM [8] | **Inside the HSM; never assembled outside it** |
| **Where approval & transaction logic runs** | App / cloud [1] | The software layer around the HSM [6] | The software policy engine [8] | **Inside the HSM** |
| **Transaction integrity** | App-level | Payload assembled outside the HSM [6] | Payload assembled outside the HSM | **Transaction built from approver-signed data inside the HSM** |
| **Approver credential** | Cloud authentication [1] | — | — | **Hardware-backed passkey** |
| **Non-custodial via true key split** | Single key reassembled in enclave [1] | Configurable [7] | Configurable [9][10] | **HSM + user-side share; no single party can reconstruct** |
| **Built for** | Consumer app onboarding [3] | Developer key infrastructure [5] | Broad enterprise suite [9] | **Institutional, bank-grade custody** |

*(Comparison based on publicly available information; see References.)*

## Privy: great for consumer apps — not for institutional custody

Privy is embedded-wallet infrastructure for application developers, designed to drop a wallet into a consumer app behind email or social login. [3] It splits each key with Shamir's Secret Sharing and reassembles the full key **in a general-purpose cloud enclave** (Intel SGX or AWS Nitro) at signing time. [1]

**The gap:** the entire security model rests on a shared cloud enclave. Privy's own documentation is candid that whoever controls the enclave controls the keys, and that TEEs have a history of side-channel exposure. [2] That's an acceptable trade for a consumer app chasing onboarding conversion — but it is not a dedicated, certified hardware boundary, and the full key does momentarily exist in one place.

> **Why Secubit wins:** Secubit never reassembles a key in a shared cloud environment. Keys live inside a FIPS-certified HSM and the signing logic runs there too — a purpose-built, tamper-resistant boundary instead of a general-purpose enclave shared across a cloud platform.

## Dfns: the HSM is a vault — the brain is still in software

Dfns is a capable, developer-focused key platform built on MPC, with the option to use an HSM instead. [5] But in its HSM mode, the HSM is a **blind signing engine**: it stores the wrapped key and produces signatures, while the approval and policy logic runs in the surrounding software. [6]

**The gap:** the HSM doesn't understand *what* it is signing. The semantic checks — is this approver legitimate, is this destination allowed, is this amount within policy — live in the orchestration software, which is precisely the layer attackers compromise. A breached server can request a signature the HSM will faithfully produce.

> **Why Secubit wins:** Secubit moves the brain into the hardware. Approval verification and transaction construction happen **inside** the HSM, so even with full control of the surrounding servers, an attacker cannot forge an approval or alter what gets signed.

## Fireblocks: a broad suite, but the default trust model is software in the cloud

Fireblocks is the broadest platform of the group, spanning a counterparty network, treasury, tokenization, and payments. [9] Its default security model is MPC, splitting keys across Intel SGX enclaves hosted in multiple clouds — and that MPC does **not** run inside HSMs. An HSM only appears through the optional "Key Link" path, as an alternative to MPC rather than a backing store for it. [8]

**The gap:** by default the root of trust is software-based MPC distributed across cloud enclaves, with the policy engine in software. The record-setting institutional thefts of recent years didn't break the key math — they exploited the approval and orchestration layer. A platform whose semantic controls sit in software inherits exactly that exposure.

> **Why Secubit wins:** Secubit's hardware-enforced approvals and in-HSM transaction construction target the approval-layer attack that has caused the largest losses head-on. The check that matters most happens where it can't be tampered with — inside certified hardware — not in a cloud control plane.

## The Secubit difference

Secubit keeps the advantages institutions actually need and removes the weak point everyone else leaves exposed:

- **Wallet and policy logic inside the HSM.** The trust-critical work happens within the tamper-resistant boundary, not in a server or cloud enclave around it.
- **Transactions built inside the HSM.** Secubit's HSM constructs the Bitcoin or Ethereum transaction from structured data — amount, destination — that an approver has cryptographically signed. What an approver authorizes is provably what gets signed; a server breach cannot swap the destination after the fact.
- **Passkey-based approvals.** Hardware-backed, phishing-resistant credentials, rather than cloud authentication or a software-held key.
- **True non-custodial mode.** A real key split between the HSM and the user's side (HSM + MPC), so no single party — not even Secubit — can reconstruct the key. A custodial mode is available when an institution wants it.
- **Delivered as a service.** Institutions integrate an API instead of designing and operating their own key infrastructure — hardware-grade security with SaaS speed.

## The bottom line

Privy optimizes for consumer onboarding. Dfns and Fireblocks are strong platforms — but both leave the approval and transaction logic in software around the hardware, which is exactly where attackers strike. Secubit puts that logic **inside** the HSM, builds the transaction from approver-signed intent within the boundary, and delivers it all as a service.

For an institution that cannot afford a server breach to become a fund loss, that difference isn't a detail — it's the whole point.

**See Secubit in action:** [wallet.secubit.io](https://wallet.secubit.io) · [api.secubit.io](https://api.secubit.io) · [whitepaper.secubit.io](https://whitepaper.secubit.io)

## References

1. Privy — *Security architecture* (Shamir Secret Sharing, TEE shares, key reconstituted only inside the enclave at signing): https://docs.privy.io/security/wallet-infrastructure/architecture
2. Privy — *Embedded Wallets 101* ("whoever owns the enclave owns the keys"; TEE side-channel and vendor-dependency caveats): https://www.privy.io/embedded-wallets-101
3. Privy — *How Privy embedded wallets work* (consumer onboarding focus; account scale; TEE + key sharding): https://privy.io/blog/how-privy-embedded-wallets-work
4. Openfort — *Best Wallet-as-a-Service (WaaS) Providers* (notes Privy's Stripe acquisition and billing/identity integration): https://www.openfort.io/blog/best-wallet-as-a-service
5. Dfns API documentation (DeepWiki) — MPC/TSS key shares distributed across nodes with a signing threshold, 50+ chains; HSM offered as an alternative store: https://deepwiki.com/dfns/dfns-api-docs
6. Dfns — *Using Hardware Security Modules (HSMs)* (HSM is an alternative to the MPC cluster, integrated via PKCS#11; the wrapped key is unwrapped and signed inside the HSM, with no persistent key storage in the HSM): https://docs.dfns.co/d/guides/using-hardware-security-modules-hsms
7. Dfns — *Delegated Signing* (custodial vs. self-custodial configuration): https://docs.dfns.co/d/advanced-topics/delegated-signing
8. Securosys Docs — *Store Fireblocks signing keys on a Primus HSM* (Fireblocks' default MPC splits keys across Intel SGX enclaves in multiple clouds; Key Link is the separate alternative for connecting an HSM/KMS): https://docs.securosys.com/fireblocks/overview/
9. Fireblocks — *Digital Asset Custody 101* (platform scope; Fireblocks as a custody technology provider): https://www.fireblocks.com/report/digital-asset-custody
10. Fireblocks — *Fireblocks Custody Network / Trust Company* (configurable custody; Fireblocks Trust Company, a NYDFS-chartered limited-purpose trust company): https://www.fireblocks.com/global-custodians

*Secubit architecture details in this post are provided by Secubit. All third-party descriptions are based on publicly available product documentation and reporting and reflect our understanding at the time of writing. Capabilities evolve quickly; verify current specifications with each provider before making decisions.*
