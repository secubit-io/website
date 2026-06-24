---
title: "AI Just Changed the Custody Threat Model — Here's How Secubit Was Built for It"
date: 2026-06-24
tag: Security
read_time: 10 min read
author: Secubit Team
excerpt: "Frontier AI models can now find and exploit software vulnerabilities at a speed and cost that used to protect custody systems by default. Here's why that breaks the old assumptions — and why Secubit anchors trust in hardware, not software."
featured: true
---

<figure style="margin:0 0 40px;padding:32px 24px;border:1px solid rgba(66,133,244,.2);border-radius:16px;background:radial-gradient(circle at 30% 25%, rgba(66,133,244,.16), transparent 60%), radial-gradient(circle at 75% 75%, rgba(229,72,77,.12), transparent 55%), #0a0f1e;text-align:center;">
  <svg viewBox="0 0 280 240" width="360" style="width:100%;max-width:360px;height:auto;display:block;margin:0 auto;" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g font-family="IBM Plex Mono, monospace" font-size="13">
      <!-- cloud host -->
      <g transform="translate(0,-15)">
        <path d="M40 52 a11 11 0 0 1 1 -22 a15 15 0 0 1 29 -3 a10 10 0 0 1 2 25 z" fill="none" stroke="#6b7894" stroke-width="1.6" />
        <text x="56" y="76" fill="#5a6781" text-anchor="middle">cloud host</text>
      </g>
      <!-- SGX enclave = CPU chip -->
      <g transform="translate(44,52)">
        <rect x="126" y="30" width="28" height="28" rx="4" fill="none" stroke="#6b7894" stroke-width="1.6" />
        <rect x="134" y="38" width="12" height="12" rx="2" fill="none" stroke="#6b7894" stroke-width="1.4" />
        <g stroke="#6b7894" stroke-width="1.4">
          <line x1="132" y1="24" x2="132" y2="30" />
          <line x1="140" y1="24" x2="140" y2="30" />
          <line x1="148" y1="24" x2="148" y2="30" />
          <line x1="132" y1="58" x2="132" y2="64" />
          <line x1="140" y1="58" x2="140" y2="64" />
          <line x1="148" y1="58" x2="148" y2="64" />
          <line x1="120" y1="36" x2="126" y2="36" />
          <line x1="120" y1="44" x2="126" y2="44" />
          <line x1="120" y1="52" x2="126" y2="52" />
          <line x1="154" y1="36" x2="160" y2="36" />
          <line x1="154" y1="44" x2="160" y2="44" />
          <line x1="154" y1="52" x2="160" y2="52" />
        </g>
        <text x="140" y="78" fill="#5a6781" text-anchor="middle">SGX enclave</text>
      </g>
      <!-- MPC = split key shares -->
      <g transform="translate(-16,-34)">
        <circle cx="204" cy="44" r="8" fill="none" stroke="#6b7894" stroke-width="1.6" />
        <circle cx="204" cy="44" r="3" fill="none" stroke="#6b7894" stroke-width="1.4" />
        <g stroke="#6b7894" stroke-width="3" stroke-linecap="round">
          <line x1="213" y1="44" x2="219" y2="44" />
          <line x1="223" y1="44" x2="229" y2="44" />
          <line x1="233" y1="44" x2="239" y2="44" />
        </g>
        <g stroke="#6b7894" stroke-width="1.6" stroke-linecap="round">
          <line x1="229" y1="44" x2="229" y2="50" />
          <line x1="237" y1="44" x2="237" y2="51" />
        </g>
        <text x="224" y="76" fill="#5a6781" text-anchor="middle">MPC shares</text>
      </g>
      <!-- kernel = terminal window -->
      <rect x="50" y="80" width="46" height="30" rx="4" fill="none" stroke="#6b7894" stroke-width="1.6" />
      <line x1="50" y1="88" x2="96" y2="88" stroke="#6b7894" stroke-width="1.2" />
      <path d="M59 95 l5 4 l-5 4" fill="none" stroke="#6b7894" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="68" y1="103" x2="77" y2="103" stroke="#6b7894" stroke-width="1.6" stroke-linecap="round" />
      <text x="73" y="124" fill="#5a6781" text-anchor="middle">kernel</text>
      <!-- AI scan crosshair -->
      <line x1="36" y1="12" x2="244" y2="112" stroke="#e5484d" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
      <line x1="244" y1="12" x2="36" y2="112" stroke="#e5484d" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
      <!-- AI = skeleton-like bot head -->
      <text x="140" y="26" fill="#ff6b6b" font-size="15" font-weight="600" text-anchor="middle">AI</text>
      <line x1="140" y1="42" x2="140" y2="35" stroke="#e5484d" stroke-width="1.5" />
      <circle cx="140" cy="33" r="2.4" fill="#e5484d" />
      <rect x="115" y="52" width="5" height="12" rx="2" fill="#0c1426" stroke="#e5484d" stroke-width="1.4" />
      <rect x="160" y="52" width="5" height="12" rx="2" fill="#0c1426" stroke="#e5484d" stroke-width="1.4" />
      <rect x="120" y="42" width="40" height="35" rx="9" fill="#0c1426" stroke="#e5484d" stroke-width="1.8" />
      <circle cx="131" cy="55" r="4.4" fill="#ff6b6b" />
      <circle cx="149" cy="55" r="4.4" fill="#ff6b6b" />
      <rect x="128" y="64" width="24" height="7" rx="1.5" fill="none" stroke="#e5484d" stroke-width="1.4" />
      <line x1="136" y1="64" x2="136" y2="71" stroke="#e5484d" stroke-width="1.2" />
      <line x1="144" y1="64" x2="144" y2="71" stroke="#e5484d" stroke-width="1.2" />
      <!-- hardware root at the core -->
      <rect x="32" y="168" width="216" height="30" rx="5" fill="#0c1426" stroke="#4285F4" stroke-width="1.8" />
      <text x="140" y="183" fill="#4285F4" font-size="14" text-anchor="middle" dominant-baseline="central">HSM</text>
    </g>
  </svg>
  <figcaption style="margin-top:18px;color:#8a96ad;font-size:14px;line-height:1.5;">AI now scans every software layer — cloud host, kernel, SGX enclave, MPC shares — at machine speed. Secubit anchors trust in the one layer it can't reach to: the HSM.</figcaption>
</figure>

For most of crypto's history, custody systems were protected less by any single unbreakable layer than by the **sheer complexity of getting through all of them.** Reaching the core of an MPC wallet — the signing nodes, often running inside SGX enclaves on cloud hosts — meant chaining together several hard exploits in sequence: a memory bug here, a side channel there, a protocol flaw somewhere deep in the stack, each requiring rare expertise and weeks or months of patient work. The funds behind those layers were always worth attacking. What kept attackers out was that penetrating every layer in the right order to reach the core was genuinely hard — a feat reserved for a handful of nation-state-grade teams.

That barrier is the one AI just lowered. The complexity of finding and chaining software vulnerabilities — the very thing that made the core hard to reach — is collapsing, and custody, where the money sits one signature away from being gone, is exactly where that collapse will be felt first. This post explains the shift, and why Secubit was architected from day one to put its trust in hardware rather than in any layer of software an AI can read, reason about, and break.

## The old custody threat model was a race against complexity

A serious custody system is built in layers. There's the application, the operating system, the cloud or on-prem infrastructure, the cryptographic protocol (often MPC), and — in the more careful designs — a hardware or "trusted execution" boundary meant to hold the key material. The security argument was never that each layer was flawless. It was that **an attacker had to defeat all of them at once, in the right order, faster than anyone would notice.**

That complexity did a lot of quiet work. MPC wallets whose key shares lived in ordinary server memory were, in principle, exposed to memory-scraping malware — but exploiting that required first breaching the host, then the runtime, then understanding a specific threshold-signature implementation well enough to lift a usable share. Cloud-hosted signers behind SGX enclaves leaned on the same logic: even if the enclave had a known weakness, weaponizing it against a particular deployment took a specialist, and stringing the whole chain together took many of them. Most custody systems were never breached at the key layer not because the prize wasn't tempting — it always was — but because assembling the full intrusion was beyond all but the most determined teams.

Security-by-complexity is only ever as good as the complexity. Lower it, and every latent weakness that was "technically exploitable but practically out of reach" moves within reach.

## AI is collapsing the cost of breaking layers

This is no longer hypothetical, and it is no longer a forecast. The capability is here and documented.

In April 2026, an evaluation of Anthropic's **Claude Mythos Preview** showed a frontier model autonomously finding and *exploiting* vulnerabilities at a scale earlier models couldn't approach: against a set of Firefox JavaScript bugs it produced 181 working exploits where the prior-generation model managed 2, and it surfaced long-dormant flaws like a 17-year-old remote-code-execution bug in FreeBSD's NFS implementation (CVE-2026-4747). [1] Tested on real Linux kernel CVEs from 2024–2025, it converted more than half of the exploitable candidates into working privilege-escalation exploits — and completed one full exploit chain in under a day for under $2,000. [1]

Google's **Big Sleep** agent tells the same story from the discovery side. It found a zero-day in the SQLite database engine in late 2024, went on to report its first 20 real-world vulnerabilities across widely used open-source software, and in 2025 was used to catch a critical SQLite flaw (CVE-2025-6965) that was known to threat actors — the first publicly reported case of an AI agent directly heading off an in-the-wild exploit. [2][3] By late 2025, defenders were also reporting the first AI-*generated* zero-day exploits observed in actual attacks, and criminal and state groups openly using models to accelerate vulnerability research. [4]

Read those numbers against the old threat model and the implication is stark. The three things that used to gate an attacker — **finding** a bug, **understanding** an unfamiliar codebase well enough to exploit it, and **chaining** several exploits into a working intrusion — are precisely the three things these models do quickly and cheaply. An MPC protocol implementation is just code. An enclave's software stack is just code. The cloud control plane around a signer is just code. AI reads all of it, reasons about it, and looks for the door. The weeks-to-months of specialist effort that protected the deep layers of a custody system are compressing toward hours and dollars.

## This is already being aimed at wallets and financial systems

The most important point is that none of this is speculative for our industry. AI is not merely *capable* of attacking financial software — it is already being pointed at it.

- **Frontier models are running real intrusions, with financial targeting baked in.** In its August 2025 threat report, Anthropic documented an operation it tracks as GTG-2002 — "vibe hacking" — in which an actor used Claude Code to automate reconnaissance, credential harvesting, and network penetration across at least 17 organizations, letting the model make tactical decisions about which data to steal and *analyze victims' financial data to set ransom demands* that sometimes exceeded $500,000. The same report describes AI-generated ransomware sold on dark-web forums for as little as $400. [10] The barrier of skill and experience that used to gate this work is gone; it is now gated mainly by access to a capable model. [10]
- **State actors are using AI to build crypto-theft tooling.** In February 2026, Google's Mandiant attributed a campaign to the North Korea-linked group UNC1069 that misused Google's Gemini to *develop code to steal cryptocurrency*, paired with AI-generated deepfake video lures impersonating figures in the crypto industry to deliver a backdoor. The group has spent years targeting centralized exchanges and developers at financial institutions. [11]
- **The people building wallets are saying it out loud.** Ledger CTO Charles Guillemet put it bluntly in April 2026: "Finding vulnerabilities and exploiting them becomes really, really easy. The cost is going down to zero." He warns that AI will help produce code that is "insecure by design," and describes malware that already scans compromised phones for wallet seed phrases and drains funds with no user interaction. [12]

These are different attackers — a profit-driven extortion crew, a sanctioned state program, and a hardware-wallet vendor's own security lead — converging on the same observation. The economics and skill curve that protected custody have flipped, and the funds are the explicit objective.

## Why custody is where this lands first

Not every system is an equally attractive target for a cheaper, faster attacker. Custody is the worst-case combination of properties:

- **The reward is immediate and liquid.** Defeat the layers, get a signature, move the funds — and on most chains the transfer is irreversible within minutes. There is no chargeback, no fraud-reversal window, no insurer who can claw it back.
- **The funds are the target, not a means to one.** Unlike a data breach that an attacker still has to monetize, a custody breach *is* the payday.
- **The attack surface is broad and software-heavy.** Many custody stacks concentrate enormous value behind layers — software wallets, server-held key shares, enclave-based signers, cloud orchestration — that were each designed under the old "too much effort to be worth it" assumption.

We have already seen what happens when even one layer above the key gives way. The February 2025 Bybit theft drained roughly **$1.5 billion** not by breaking cryptography but by compromising the signing *interface*, so approvers authorized a malicious transaction while seeing a benign one. [5] That was a human-and-software-layer failure executed by people. The uncomfortable question AI forces is: what does that class of attack look like when finding and chaining the underlying software flaws costs an adversary a day and a few thousand dollars instead of a specialist team and a quarter?

## The soft layers were never meant to be the last line

Step back and look at where custody systems have historically placed their trust, and a pattern emerges: **most of it sits in software and in software-adjacent hardware features.** Application code. The operating system. Cloud infrastructure (AWS and its peers). And, critically, CPU "confidential computing" features like Intel SGX, which many designs lean on as their trusted hardware boundary.

SGX deserves special attention because it is so often presented as the hardware root of trust — and because its track record under scrutiny is exactly the cautionary tale this moment demands. The academic community has been breaking SGX for years, to the point that researchers maintain a running catalog of the failures at **sgx.fail**, which documents how SGX's own update and recovery mechanisms leave real deployments exposed long after disclosure — patches that arrive months late, on machines that are cumbersome to update and so frequently never are. [6] The attacks are not theoretical curiosities:

- **Foreshadow, Downfall, and the xAPIC/MMIO class** of micro-architectural attacks have repeatedly let attackers read enclave secrets or bypass SGX's protections across multiple processor generations. [6]
- In October 2025, the **WireTap** attack extracted an SGX machine's ECDSA *attestation* key in about 45 minutes using a DDR4 memory-bus interposer built from second-hand parts for under $1,000 — letting the attacker forge attestation quotes indistinguishable from a genuine enclave. The related **Battering RAM** attack broke the integrity side of the same deterministic-encryption weakness. [7]

Intel's response to the interposer attacks is revealing: it noted they require physical access and fall *outside the product's threat model.* [7] That is a perfectly reasonable position for a general-purpose CPU feature — and a disqualifying one for custody. If your last line of defense around hundreds of millions in client assets is a feature whose own vendor brackets entire attack classes as out of scope, you are trusting the wrong layer. SGX was designed to make confidential computing convenient, not to be the vault for irreversible bearer assets.

That is the deeper point. Software layers, cloud control planes, and CPU enclave features were never engineered to be the *final* barrier between an adversary and a private key. They held up mostly because attacking them was expensive. AI is the thing that makes attacking them cheap.

## Secubit's answer: move trust out of software, into hardware

Secubit was not retrofitted for this threat. The architecture starts from the conclusion that everything an AI can read and reason about — software, servers, clouds, and CPU features like SGX — should be treated as *untrusted*, and that the only acceptable place to anchor trust is in hardware purpose-built to resist attack: a certified Hardware Security Module, and an offline approving device that never exposes its secrets to a connected, AI-reachable environment.

Concretely, that principle shows up as:

- **Trust lives in FIPS 140-3 Level 3 HSMs, not in software.** Keys are generated inside the HSM's true random number generator and are *never exported*; every signing operation happens inside the tamper-resistant boundary. There is no key sitting in server memory, a config file, or an enclave for malware — AI-written or otherwise — to lift. [8]
- **The MPC share computes inside the HSM.** Where many designs run their multi-party computation in ordinary software (the soft target AI feeds on), Secubit's signing share lives and computes *inside* the certified hardware boundary. Distributed trust and a tamper-resistant home for the most sensitive share, in one design. [9]
- **Transactions are constructed inside the HSM.** Rather than asking an approver to sign a finished, externally-prepared payload — the model that failed at Bybit — the HSM builds the transaction itself from approver-signed structured data (amount, destination) and signs only what it constructed. There is no external payload for a compromised, AI-assisted interface to swap. [8]
- **Approvals are bound to passkeys and an offline device, not to software-held keys.** Approvers authenticate with passkeys (WebAuthn) anchored to device hardware, and the quorum is enforced by the HSM before any signature is released — so there is no software-resident credential for malware to capture or misuse. [8]
- **Both custody models keep the key out of software.** In *custodial* mode the full key lifecycle stays inside Secubit's HSMs under client-defined quorum rules; in *non-custodial* mode control is split via MPC between the Secubit HSM network and a client-held share, so Secubit alone cannot move funds. [8]

The throughline is simple: an attacker armed with a model that can break any amount of software still has to get past hardware that exposes no key to break *into*. You cannot exfiltrate a key that never leaves the HSM, and you cannot swap a payload the HSM constructed itself.

## What an AI-empowered attacker actually has to defeat

| Layer in the kill chain | Software / enclave-anchored custody | Secubit (hardware-anchored) |
| --- | --- | --- |
| Reach a usable key or share | Often a server-memory or enclave secret — extractable once layers fall | Key/share never leaves the FIPS 140-3 Level 3 HSM [8][9] |
| Defeat the "hardware" boundary | CPU enclave features (e.g. SGX) repeatedly broken; physical attacks out of vendor scope [6][7] | Certified tamper-resistant HSM; secrets zeroized on physical attack [8] |
| Subvert the approval | Sign an externally-prepared payload a compromised UI can swap [5] | HSM constructs and signs its own transaction; passkey + offline approval [8] |
| Act unilaterally | Possible if one entity holds the whole key | MPC split; no single party — including Secubit — can sign alone [8] |

The columns describe the same adversary. The difference is what that adversary finds when the friction is gone: in the software-anchored model, a cheaper attacker eventually reaches a real key; in the hardware-anchored model, there is no key in software to reach.

## What this means for institutions

The lesson of the last few years was that custody fails at its weakest layer. The lesson of the next few is that **AI is about to test every layer at once, at machine speed** — and that "reaching the core was too complex to be practical" was never a security property. It was a difficulty barrier, and AI is tearing it down.

The defensible response is not to add more clever software around the key. Every layer you can write in software is a layer an AI can learn to break. The response is to stop trusting those layers with the thing that matters and to anchor custody in hardware that exposes no secret to break into in the first place — a certified HSM and an offline approving device, with MPC computed inside the boundary and transactions constructed where no compromised interface can reach them. That is the bet Secubit made before it was fashionable, and it is the one this moment vindicates.

If your custody architecture's last line of defense is a piece of software — or a CPU feature whose vendor calls whole attack classes out of scope — assume it is now on a clock that AI is winding down. Hardware-rooted trust is how you take it off the clock.

## References

1. Help Net Security — *Anthropic's new AI model finds and exploits zero-days across every major OS and browser* (Claude Mythos Preview: 181 working Firefox exploits vs. 2 for the prior model; >half of 40 exploitable Linux kernel CVE candidates turned into working privilege-escalation exploits; one chain in under a day for under $2,000; 17-year-old FreeBSD NFS RCE, CVE-2026-4747), Apr 8 2026: https://www.helpnetsecurity.com/2026/04/08/anthropic-claude-mythos-preview-identify-vulnerabilities/
2. The Hacker News — *Google's AI Tool Big Sleep Finds Zero-Day Vulnerability in SQLite Database Engine* (first real-world zero-day found by the LLM-assisted Big Sleep agent), Nov 2024: https://thehackernews.com/2024/11/googles-ai-tool-big-sleep-finds-zero.html
3. The Hacker News — *Google AI "Big Sleep" Stops Exploitation of Critical SQLite Vulnerability Before Hackers Act* (CVE-2025-6965; first AI agent to directly foil an in-the-wild exploitation effort; 20 vulnerabilities reported), Jul 2025: https://thehackernews.com/2025/07/google-ai-big-sleep-stops-exploitation.html
4. SecurityWeek — *Google Detects First AI-Generated Zero-Day Exploit* (defenders observing AI-generated exploits and adversary use of models in real attacks): https://www.securityweek.com/google-detects-first-ai-generated-zero-day-exploit/
5. NCC Group — *In-Depth Technical Analysis of the Bybit Hack* (~$1.5B drained by compromising the third-party signing interface so signers approved a malicious transaction while seeing a benign one): https://www.nccgroup.com/research/in-depth-technical-analysis-of-the-bybit-hack/
6. SGX.Fail — *Catalog of Intel SGX attacks and the failure of its update/recovery mechanisms* (Foreshadow, Downfall, xAPIC/MMIO; real deployments left exposed long after disclosure due to delayed or never-applied BIOS patches): https://sgx.fail/
7. The Hacker News — *New WireTap Attack Extracts Intel SGX ECDSA Key via DDR4 Memory-Bus Interposer* (attestation key extracted in ~45 minutes with a sub-$1,000 interposer; related Battering RAM attack; Intel deems physical-interposer attacks outside the product threat model), Oct 2025: https://thehackernews.com/2025/10/new-wiretap-attack-extracts-intel-sgx.html
8. Secubit Whitepaper — *Introduction, Custodial Wallet, and Non-Custodial Wallet* (FIPS 140-3 Level 3 HSMs, keys never exported, in-HSM transaction construction, Passkey/WebAuthn approvals, custodial and MPC non-custodial models): https://whitepaper.secubit.io/introduction.html
9. Secubit Whitepaper — *Multi-Party Computing (MPC)* (threshold key sharing and distributed signing, with Secubit's signing share computing inside the certified HSM boundary): https://whitepaper.secubit.io/building-blocks/multi-parti-computing.html
10. Anthropic — *Detecting and countering misuse of AI: August 2025* (the "vibe hacking" GTG-2002 operation: Claude Code used to automate intrusions across 17+ organizations, analyze victims' financial data to set ransom demands exceeding $500,000, and AI-generated ransomware sold on dark-web forums), Aug 27 2025: https://www.anthropic.com/news/detecting-countering-misuse-aug-2025
11. The Hacker News — *North Korea-Linked UNC1069 Uses AI Lures to Attack Cryptocurrency Organizations* (per Google Mandiant: misuse of Gemini to develop code to steal cryptocurrency, AI deepfake lures impersonating crypto-industry figures, targeting centralized exchanges and financial-institution developers), Feb 11 2026: https://thehackernews.com/2026/02/north-korea-linked-unc1069-uses-ai.html
12. CoinDesk — *AI is breaking crypto security by making hacks cheaper and easier, Ledger CTO warns* (Charles Guillemet: "Finding vulnerabilities and exploiting them becomes really, really easy. The cost is going down to zero"; code "insecure by design"; malware scanning phones for wallet seed phrases), Apr 5 2026: https://www.coindesk.com/tech/2026/04/05/ai-is-making-crypto-s-security-problem-even-worse-ledger-cto-warns

> Secubit's architecture details in this post are first-party. Descriptions of third-party AI capabilities, security incidents, and standards reflect public information available at the time of writing; every external claim is cited above so you can verify it independently.
