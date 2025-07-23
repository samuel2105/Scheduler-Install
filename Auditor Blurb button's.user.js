// ==UserScript==
// @name         Slack GT Handler – Enhanced GT S Red Label Fix with Fallback
// @namespace    http://tampermonkey.net/
// @version      7.4
// @description  GT Buttons for Slack — with fallback Custom button for unmatched station codes ❌🟦🛠️
// @author       samumzz
// @match        https://app.slack.com/client/E015GUGD2V6/C07RAGBM36G*
// @match        https://app.slack.com/client/E015GUGD2V6/C07NS9SLFQC*
// @match        https://app.slack.com/client/E015GUGD2V6/C07N98FP207*
// @match        https://app.slack.com/client/E015GUGD2V6/C07PCJGB5HN*
// @match        https://app.slack.com/client/E015GUGD2V6/C07PCJ93BB2*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STATION_CODE_REGEX = /([A-Z]{3}[0-9])/;

    const patterns = [
        {
            regex: /^([A-Z]{3}[0-9]) GT R \?$/,
            green: s => `${s} GT R`,
            yellow: s => `${s} Hold`,
            red: s => `${s} incorrect checklist`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT DPO \?$/,
            green: s => `${s} GT DPO`,
            red: s => `${s} Incorrect`,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT AA, DPO \?$/,
            green: s => `${s} GT AA DPO`,
            red: s => `${s} Incorrect`,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT AA,DSP DPO \?$/,
            green: s => `${s} GT AA , DSP DPO`,
            red: s => `${s} Incorrect`,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT P \?$/,
            green: s => `${s} GT P`,
            red: s => `${s} Incorrect Demand`,
            yellow: s => `${s} GT C. Pre-Schedules Matched`,
            purple: s => `${s} GT C. Pre-Schedules Matched`,
            yellowLabel: 'GT C',
            purpleLabel: 'Preff'
        },
        {
            regex: /^([A-Z]{3}[0-9]) - [A-Z_0-9]+ - Not Protected/i,
            green: s => `${s} GT P`,
            red: s => `${s} Incorrect Demand`,
            yellow: s => `${s} GT C. Pre-Schedules Matched`,
            purple: s => `${s} Please share Preff Sheet`,
            yellowLabel: 'GT C',
            purpleLabel: 'Preff'
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT C \?$/,
            green: s => `${s} GT C`,
            yellow: s => `${s} Match the New Pre-Schedules `,
            yellowLabel: 'Match the Pre-Schedules'
        },
        {
            regex: /^([A-Z]{3}[0-9]) Vol Var/i,
            gray: s => `${s} checking...`,
            green: s => `${s} GT DPO`,
            yellow: s => `${s} Re-Planning, Inform the Site`,
            purple: s => `${s} Re-Planning started`,
            yellowLabel: 'Notify',
            purpleLabel: 'Re-Plan Started'
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT S \?$/,
            green: s => `${s} GT S`,
            red: s => `${s} GT Deny`,
            greenLabel: 'GT Proceed',
            redLabel: 'Deny'
        },
        {
            regex: /^([A-Z]{3}[0-9]) No Nursery's \?$/,
            gray: s => `${s} checking...`,
            green: s => `${s} GT Proceed All for C1 `,
            yellow: s => `${s} Re-Planning, Inform the Site`,
            purple: s => `${s} Re-Planning started`,
            yellowLabel: 'Notify',
            purpleLabel: 'Re-Plan Started',
            greenLabel: 'All for C1',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT Re-Plan \?$/,
            green: s => `${s} GT R `,
            red: s => `${s} Incorrect`,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT Uploaded AMXL_1 Inclusion \?$/,
            green: s => `${s} GT Upload `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT Uploaded AMXL_1 Exclusion \?$/,
            green: s => `${s} GT Upload `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) GT CT\s*\?$/,
            green: s => `${s} GT CT `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) Addon.?s\s+GT CT into Sunrise \?$/,
            green: s => `${s} GT CT `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) Addon.?s\s+GT CT into AM \?$/,
            green: s => `${s} GT CT `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) AA partially completed GT G \?$/,
            gray: s => `${s} checking...`,
            green: s => `${s} GT G `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
        },
        {
            regex: /^([A-Z]{3}[0-9]) AA Timed Out \?$/,
            gray: s => `${s} checking...`,
            green: s => `${s} GT G `,
            yellow: s => `${s} GT Re-Run AA`,
            yellowLabel: 'Re-Run',
            greenLabel: 'GT G',
        },
        {
            regex: /^([A-Z]{3}[0-9]) Unassigned DSP's \?$/,
            gray: s => `${s} checking...`,
            green: s => `${s} GT G `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
            greenLabel: 'GT G',
        },
        {
            regex: /^([A-Z]{3}[0-9]) (\d+) Un-planned DSP'S \?$/,
            gray: s => `${s} checking...`,
            green: s => `${s} GT G `,
            yellow: s => `${s} Hold`,
            yellowLabel: 'Hold',
            greenLabel: 'GT G',
        },
    ];

    function createButton(color, label, message, send = true) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'gtr-multi-btn';
        btn.style.marginLeft = '6px';
        btn.style.padding = '2px 6px';
        btn.style.fontSize = '12px';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = color;
        btn.style.color = 'white';

        btn.addEventListener('click', async () => {
            const stationCode = message.split(' ')[0];
            try {
                await navigator.clipboard.writeText(stationCode);
                console.log(`📋 Copied to clipboard: ${stationCode}`);
            } catch (err) {
                console.warn("❌ Clipboard write failed:", err);
            }

            const inputDiv = document.querySelector('[data-qa="message_input"] div[role="textbox"]');
            if (!inputDiv) {
                alert("⚠️ Could not find Slack input box.");
                return;
            }

            inputDiv.focus();
            const range = document.createRange();
            range.selectNodeContents(inputDiv);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('insertText', false, message);

            if (send) {
                setTimeout(() => {
                    const enterEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        which: 13,
                        keyCode: 13
                    });
                    inputDiv.dispatchEvent(enterEvent);
                    console.log("📨 Sent Slack message:", message);
                }, 300);
            } else {
                console.log("✏️ Only pasted (not sent):", message);
            }
        });

        return btn;
    }

    function attachButtons(msgEl, stationCode, pattern) {
        if (msgEl.querySelector('.gtr-multi-btn')) return;

        const wrapper = document.createElement('span');
        wrapper.style.marginLeft = '8px';

        if (pattern) {
            if (pattern.gray) wrapper.appendChild(createButton('gray', pattern.grayLabel || 'Check', pattern.gray(stationCode)));
            if (pattern.green) wrapper.appendChild(createButton('green', pattern.greenLabel || 'GT Proceed', pattern.green(stationCode)));
            if (pattern.yellow) wrapper.appendChild(createButton('goldenrod', pattern.yellowLabel || 'GT C', pattern.yellow(stationCode)));
            if (pattern.red) wrapper.appendChild(createButton('crimson', pattern.redLabel || 'Incorrect', pattern.red(stationCode)));
            if (pattern.purple) wrapper.appendChild(createButton('purple', pattern.purpleLabel || 'Preff', pattern.purple(stationCode)));
        }

        // Always add Custom fallback button
        wrapper.appendChild(createButton('blue', 'Custom', `${stationCode}`, false));

        msgEl.appendChild(wrapper);
    }

    function scanMessages() {
        const items = document.querySelectorAll('[role="listitem"]');
        items.forEach(item => {
            if (item.dataset.gtrButtons === 'true') return;
            item.dataset.gtrButtons = 'true';

            const msgTextEl = item.querySelector('[data-qa="message-text"]');
            if (msgTextEl) {
                const text = msgTextEl.innerText.trim();
                let matched = false;

                for (const pattern of patterns) {
                    const match = text.match(pattern.regex);
                    if (match) {
                        const stationCode = match[1];
                        attachButtons(msgTextEl, stationCode, pattern);
                        matched = true;
                        break;
                    }
                }

                // Fallback: only station code match
                if (!matched) {
                    const fallbackMatch = text.match(STATION_CODE_REGEX);
                    if (fallbackMatch) {
                        const stationCode = fallbackMatch[1];
                        attachButtons(msgTextEl, stationCode, null); // only custom
                    }
                }
            }
        });
    }

    function startObserver() {
        const chatList = document.querySelector('[role="presentation"] [role="list"]');
        if (!chatList) {
            console.log("⏳ Waiting for Slack chat container...");
            setTimeout(startObserver, 2000);
            return;
        }

        scanMessages();

        const observer = new MutationObserver(() => {
            scanMessages();
        });

        observer.observe(chatList, {
            childList: true,
            subtree: true
        });

        console.log("🚀 Slack GT Handler (v7.4) Loaded!");
    }

    const style = document.createElement('style');
    style.textContent = `
        .gtr-multi-btn:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);

    setTimeout(startObserver, 5000);
})();
