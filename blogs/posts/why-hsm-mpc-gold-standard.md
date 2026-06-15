---
title: "Why HSM + MPC Is the Gold Standard for Institutional Crypto Custody"
date: 2026-06-15
tag: Security
read_time: 9 min read
author: Secubit Team
excerpt: "How combining hardware security modules with multi-party computation removes single points of failure without sacrificing key sovereignty."
featured: false
---

Every custody system eventually answers one question: **what, exactly, has to be compromised before an attacker can move your funds?** If the honest answer is "a single key, a single server, or a single screen," you don't have institutional custody — you have a single point of failure with good branding.

The strongest custody architectures remove that single point twice over: once in *hardware*, with a tamper-resistant Hardware Security Module (HSM) that never exposes a key, and once in *protocol*, with Multi-Party Computation (MPC) that never assembles a key in the first place. Each technology closes a gap the other leaves open. Together, they are the closest thing the industry has to a gold standard. This post explains why — and how Secubit builds on both.

## The failure is almost never the math

It's tempting to assume crypto losses come from broken cryptography. They almost never do. The largest custody failures of the last few years were failures of *everything around* the key: the server that held it, the operator who could use it, or the screen that showed the approver what they were signing.

The February 2025 Bybit theft is the clearest example. Attackers drained roughly **$1.5 billion in ETH** from a cold wallet — not by cracking a private key, but by compromising the third-party signing interface so that signers saw a benign transaction while approving a malicious one. [1] The multi-signature wallet did exactly what it was told. The problem was that what the humans *saw* and what they *signed* were two different things. [2] Investigators traced the root cause to malicious JavaScript injected into the signing platform, not to any weakness in the underlying multisig cryptography. [3]

That is the real institutional threat model, and it has three recurring shapes:

- **Key exfiltration** — a key sitting in server memory, a config file, or a software wallet gets stolen.
- **Insider misuse** — a single administrator or operator has enough access to move funds unilaterally.
- **Approval subversion** — the signers are tricked into authorizing something other than what they intended.

A serious custody architecture has to answer all three. As we'll see, an HSM answers the first two decisively and MPC answers them differently — but the third, approval subversion, is where most "secure" systems quietly fall down, and where the *combination* matters most.

## What an HSM gives you — and where it stops

A Hardware Security Module is a purpose-built, tamper-resistant device for generating, storing, and using cryptographic keys. Unlike a general-purpose server or a software library, an HSM enforces a hardened boundary — physical and logical — so that private keys never leave the device in plaintext, and every sensitive operation happens *inside* the secure enclosure. [4]

HSMs have anchored digital trust in banking, payments, and certificate authorities for decades. In custody, that pedigree translates into concrete guarantees:

- **Keys are born and die inside hardware.** Keys are generated using the HSM's true random number generator (TRNG) and are never exposed outside the device — eliminating the weak-randomness and software-key-creation failures that quietly undermine other systems. [4]
- **Signing happens in-boundary.** Because key material never reaches application memory, malware and memory scraping have nothing to grab. [4]
- **Tamper resistance is physical.** Protective meshes, sensors, and active countermeasures detect probing or fault injection and *zeroize* secrets on attack. [4]
- **Policy is enforced in hardware.** Quorum approvals, dual control, and usage limits are implemented in the device itself, so compromised host software can't bypass them. [4]
- **Assurance is certified.** FIPS 140-3 Level 3 validation provides independent, regulator-recognized evidence of tamper resistance, role separation, and identity-based authentication — the baseline regulated institutions are expected to meet. [5]

That's a powerful answer to key exfiltration and insider misuse. But an HSM, on its own, has a structural limit: **in a purely custodial HSM deployment, the operator's infrastructure still holds the complete key.** The key is locked in tamper-resistant hardware and governed by policy — but it is *one* key, in *one* organization's custody domain. For an institution that wants genuine key sovereignty — the assurance that *no single party*, including the custody provider, can ever act unilaterally — hardware protection alone doesn't get you all the way there. That is precisely the gap MPC was built to close.

## What MPC gives you — and where it stops

Multi-Party Computation takes a different route to the same goal. Instead of protecting one key very well, MPC ensures the full key **never exists in one place at all.** [6]

The protocol creates cryptographic *shares* of a key, distributed across independent parties. Each party holds only its own share. When a transaction needs signing, each party computes a *partial signature* with its share, and the partials combine into a single valid signature the blockchain recognizes as authentic — without the full private key ever being reconstructed, not during storage and not during signing. [6] To the chain, the result is indistinguishable from an ordinary signature.

This delivers guarantees an HSM alone cannot:

- **No single point of compromise.** An attacker must subvert multiple independent parties at once; a single stolen share is mathematically useless on its own. [6]
- **Distributed trust and key sovereignty.** Shares can live in different environments — an HSM, a secure element, a user device — so control is genuinely split, including between the institution and its custody provider. [6]
- **Cryptographic policy enforcement.** Quorum rules ("2-of-3 approvers," "one corporate and one external") are enforced by the math, not just by organizational discipline. [6]

But MPC has its own structural limit, and it's the mirror image of the HSM's: **a share is only as safe as the environment holding it.** If an MPC share lives in ordinary server memory or a software process, it inherits all the weaknesses of that environment — exactly the kind of soft target that key-exfiltration attacks feed on. MPC distributes trust beautifully, but it does not, by itself, make any individual share *tamper-resistant*. And MPC alone does nothing to solve approval subversion: if a share-holder is shown a spoofed transaction, splitting the key across more parties just means more people approving the wrong thing.

## Why the combination is the gold standard

Lay the two limits side by side and the answer writes itself:

| Concern | HSM alone | MPC alone | HSM **+** MPC |
| --- | --- | --- | --- |
| Key exfiltration | Strong — keys never leave hardware | Depends on share environment | Strong — the most sensitive share lives in hardware |
| Insider / unilateral control | Operator still holds the full key | Strong — control is split | Strong — split control *and* a hardware-anchored share |
| Tamper resistance | Strong — physical countermeasures | Not inherent to a share | Strong — at least one share is hardware-protected |
| Key sovereignty | Limited in custodial mode | Strong | Strong — institution and provider each hold a share |
| Certified assurance | FIPS 140-3 Level 3 | Protocol-dependent | FIPS-grade hardware *plus* distributed protocol |

HSM and MPC are not competing answers to the same question. They are **complementary answers to different questions**, and a serious institution needs both answered at once. The HSM gives MPC a tamper-resistant, certified home for its most sensitive share. MPC gives the HSM what hardware alone can't: a key that is never whole, and control that is never unilateral. [4][6] One share sits behind FIPS 140-3 Level 3 tamper resistance; the other stays under the client's control; a signature requires both to cooperate — so neither the provider, nor an insider, nor an attacker who breaches one environment can move funds alone.

That still leaves approval subversion — the Bybit failure mode. And this is where architecture, not just technology choice, decides whether a custody system is actually safe.

## How Secubit builds on both

Secubit is a Wallet-as-a-Service platform built on exactly this foundation: tamper-resistant HSMs as the hardware root of trust, MPC for distributed control, and FIPS 140-3 Level 3 hardware throughout. [7] But it goes a step further than simply running both technologies side by side.

**Transactions are constructed *inside* the HSM.** Rather than asking approvers to sign a finished, externally-prepared transaction — the model that failed at Bybit — Secubit's HSM builds the transaction itself from approver-signed *structured data* (amount, destination), and signs only what it constructed. There is no externally-supplied payload for a compromised interface to swap out. This collapses the approval-subversion attack surface that defeated a $1.5B multisig.

**Approvals are bound to passkeys, not software-held keys.** Approvers authenticate with passkeys (WebAuthn) anchored to device biometrics, so there is no RSA key sitting in an app for malware to lift or misuse. [7] The quorum is enforced by the HSM before any signature is released.

**Both custody models are first-class:**

- **Custodial mode** — the full key lifecycle stays inside Secubit's FIPS 140-3 Level 3 HSMs. Keys are never exported, and signing happens only when the HSM verifies a client-defined quorum (for example, 2-of-3). Even though Secubit holds the key, *control is always governed by the client's rules.* [8]
- **Non-custodial mode** — control is split via MPC. One share lives in the Secubit HSM network; the other is held by the client, protected by passkeys or delegated to an automated trading engine. Both shares must participate to sign, so **Secubit cannot unilaterally access or move client funds.** This is "not your keys, not your coins," made operational. [9]

The result is a system where key exfiltration, insider misuse, *and* approval subversion are each closed — by hardware, by protocol, and by architecture working together rather than any one of them carrying the whole load.

## What this means for institutions

The lesson of the last several years of custody failures is not that crypto is unsafe to hold. It is that **the security of an institutional wallet is decided by its weakest layer** — and a single key, a single operator, or a single compromised screen is a weak layer no amount of process can fully redeem.

HSM + MPC is the gold standard because it removes the single point of failure on every axis at once: keys that never leave hardware, control that is never whole in one place, and certified assurance a regulator can verify. Secubit's contribution is to make that combination practical — delivered as a service, with in-HSM transaction construction and passkey approvals closing the approval-layer gap that even well-built multisig systems leave open.

If your custody architecture can't survive the loss of any single component, it isn't institutional-grade yet. Building on HSM *and* MPC is how you make sure it can.

## References

1. TradersUnion — *Bybit Hack 2025: Full Timeline And Crypto Impact Explained* (approximately 401,000 ETH, ~$1.5B, taken from a cold-wallet system relying on a third-party multisig tool): https://tradersunion.com/brokers/crypto/view/bybit/bybit-hack-2025/
2. NCC Group — *Bybit Hack: In-Depth Technical Analysis* (the attack altered what signers saw when approving a cold-wallet transaction, causing them to authorize an unintended transfer): https://www.nccgroup.com/research/in-depth-technical-analysis-of-the-bybit-hack/
3. Bybit Learn — *Bybit Security Incident: Timeline of Events and FAQs* (preliminary reports attributed the root cause to malicious JavaScript on the third-party signing platform, with no vulnerability found in Bybit's own infrastructure): https://learn.bybit.com/en/this-week-in-bybit/bybit-security-incident-timeline
4. Secubit Whitepaper — *Hardware Security Module (HSM)* (key characteristics, core functions, and HSM-relevant threat model): https://whitepaper.secubit.io/building-blocks/hardware-security-module.html
5. NIST — *FIPS 140-3: Security Requirements for Cryptographic Modules* (the U.S. government standard validating cryptographic modules for tamper resistance, role separation, and identity-based authentication): https://csrc.nist.gov/pubs/fips/140-3/final
6. Secubit Whitepaper — *Multi-Party Computing (MPC)* (threshold key sharing, distributed signing, security benefits, and MPC-relevant threat model): https://whitepaper.secubit.io/building-blocks/multi-parti-computing.html
7. Secubit Whitepaper — *Introduction* (Wallet-as-a-Service design goals, system entities, FIPS 140-3 Level 3 HSMs, and Passkey-based approvals): https://whitepaper.secubit.io/introduction.html
8. Secubit Whitepaper — *Custodial Wallet* (full in-HSM key lifecycle with client-defined quorum approvals): https://whitepaper.secubit.io/wallet-models/custodial-wallet.html
9. Secubit Whitepaper — *Non-Custodial Wallet* (MPC key splitting between the Secubit HSM network and the client, with both shares required to sign): https://whitepaper.secubit.io/wallet-models/non-custodial-wallet.html

> Secubit's architecture details in this post are first-party. Descriptions of third-party incidents and standards reflect public information available at the time of writing; every external claim is cited above so you can verify it independently.
