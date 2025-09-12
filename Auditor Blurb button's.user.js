// ==UserScript==
// @name         Auditor Blurb's (Full Custom + Patterns)
// @namespace    http://tampermonkey.net/
// @author       samumzz(Samuel Sumanth kumar M)
// @version      8.3
// @description  GT Buttons for Slack — all patterns with fallback Custom button
// @match        https://app.slack.com/client/E015GUGD2V6/C07RAGBM36G*
// @match        https://app.slack.com/client/E015GUGD2V6/C07NS9SLFQC*
// @match        https://app.slack.com/client/E015GUGD2V6/C07N98FP207*
// @match        https://app.slack.com/client/E015GUGD2V6/C07PCJGB5HN*
// @match        https://app.slack.com/client/E015GUGD2V6/C07PCJ93BB2*
// @grant        none
// @downloadURL  https://github.com/samuel2105/Scheduler-Install/raw/main/Auditor%20Blurb%20button's.user.js
// @updateURL    https://github.com/samuel2105/Scheduler-Install/raw/main/Auditor%20Blurb%20button's.user.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '8.2';
    console.log(`🚀 Auditor Blurb's v${VERSION} initializing...`);

    // Always add a Custom button
    const ADD_CUSTOM_FALLBACK = true;

    // Regex for extracting station codes if no pattern matches
    const STATION_CODE_REGEX = /\b([A-Z]{3}[0-9])\b/;

    // Define all patterns
    const patterns = [
        { regex: /^([A-Z]{3}[0-9])\s*GT\s*R\s*\?$/i, green: s => `${s} GT R`, yellow: s => `${s} Hold`, red: s => `${s} incorrect checklist`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9])\s*GT\s*DPO\s*\?$/i, green: s => `${s} GT DPO`, red: s => `${s} Incorrect`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9])\s*GT\s*AA[, ]*\s*DPO\s*\?$/i, green: s => `${s} GT AA DPO`, red: s => `${s} Incorrect`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9])\s*GT\s*AA[, ]*\s*DSP\s*DPO\s*\?$/i, green: s => `${s} GT AA , DSP DPO`, red: s => `${s} Incorrect`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*P\s*\?$/i, green: s => `${s} GT P`, red: s => `${s} Incorrect Demand`, yellow: s => `${s} GT C. Pre-Schedules Matched`, purple: s => `${s} Please share Preff Sheet`, yellowLabel: 'GT C', purpleLabel: 'Preff' },
        { regex: /^([A-Z]{3}[0-9])\s*-\s*[A-Z0-9_]+\s*-\s*Not\s*Protected/i, green: s => `${s} GT P`, red: s => `${s} Incorrect Demand`, yellow: s => `${s} GT C. Pre-Schedules Matched`, purple: s => `${s} Please share Preff Sheet`, yellowLabel: 'GT C', purpleLabel: 'Preff' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*C\s*\?$/i, green: s => `${s} GT C`, yellow: s => `${s} Match the New Pre-Schedules`, yellowLabel: 'Match the Pre-Schedules' },

        { regex: /^([A-Z]{3}[0-9]).*Vol\s*Var/i, gray: s => `${s} checking...`, green: s => `${s} GT DPO`, yellow: s => `${s} Re-Planning, Inform the Site`, purple: s => `${s} Re-Planning started`, yellowLabel: 'Notify', purpleLabel: 'Re-Plan Started' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*S\s*\?$/i, green: s => `${s} GT S`, red: s => `${s} GT Deny`, greenLabel: 'GT Proceed', redLabel: 'Deny' },

        { regex: /^([A-Z]{3}[0-9]).*No\s*Nursery'?s\s*\?$/i, gray: s => `${s} checking...`, green: s => `${s} GT Proceed All for C1`, yellow: s => `${s} Re-Planning, Inform the Site`, purple: s => `${s} Re-Planning started`, yellowLabel: 'Notify', purpleLabel: 'Re-Plan Started', greenLabel: 'All for C1' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*Re-Plan\s*\?$/i, green: s => `${s} GT R`, red: s => `${s} Incorrect`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*Uploaded\s*AMXL_1\s*Inclusion\s*\?$/i, green: s => `${s} GT Upload`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9])\s*GT\s*Uploaded\s*AMXL_1\s*Exclusion\s*\?$/i, green: s => `${s} GT Upload`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },

        { regex: /^([A-Z]{3}[0-9])\s*GT\s*CT\s*\?$/i, green: s => `${s} GT CT`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9]).*Addon(?:s)?\s*GT\s*CT\s*into\s*Sunrise\s*\?$/i, green: s => `${s} GT CT`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9]).*Addon(?:s)?\s*GT\s*CT\s*into\s*AM\s*\?$/i, green: s => `${s} GT CT`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },

        { regex: /^([A-Z]{3}[0-9]).*AA\s*partially\s*completed\s*GT\s*G\s*\?$/i, gray: s => `${s} checking...`, green: s => `${s} GT G`, yellow: s => `${s} Hold`, yellowLabel: 'Hold' },
        { regex: /^([A-Z]{3}[0-9]).*AA\s*Timed\s*Out\s*\?$/i, gray: s => `${s} checking...`, green: s => `${s} GT G`, yellow: s => `${s} GT Re-Run AA`, yellowLabel: 'Re-Run', greenLabel: 'GT G' },

        { regex: /^([A-Z]{3}[0-9]).*Unassigned\s*DSP'?s\s*\?$/i, gray: s => `${s} checking...`, green: s => `${s} GT G`, yellow: s => `${s} Hold`, yellowLabel: 'Hold', greenLabel: 'GT G' },

        { regex: /^([A-Z]{3}[0-9])\s*(\d+)\s*Un-?planned\s*DSP'?S\s*\?$/i, gray: s => `${s} checking...`, green: s => `${s} GT G`, yellow: s => `${s} Hold`, yellowLabel: 'Hold', greenLabel: 'GT G' },
    ];

    // Selectors for Slack DOM
    const messageContainerSelectors = [
        '[data-qa="message_container"]',
        '[data-qa="virtual-list-item"]',
        '[role="listitem"]',
        '.c-virtual_list__item',
        '.c-message_kit__blocks',
        '.c-message__content',
        '.c-message__gutter'
    ];

    const messageTextSelectors = [
        '[data-qa="message-text"]',
        '.c-message__body',
        '.p-rich_text_section',
        '.c-message_kit__blocks',
        '.c-message_kit__text',
        '.c-message__content',
        '.p-rich_text_section'
    ];

    const inputSelectors = [
        '[data-qa="message_input"] div[role="textbox"]',
        'div[contenteditable="true"][role="textbox"]',
        'div[contenteditable="true"]',
        'div.p-client_text_input__textarea[contenteditable="true"]'
    ];

    const sendButtonSelectors = [
        'button[data-qa="texty_send_button"]',
        'button[aria-label="Send message"]',
        'button[title="Send message"]',
        'button[aria-label="Send"]',
        'button[title="Send"]'
    ];

    function safeCopyToClipboard(text) {
        if (!text) return Promise.resolve(false);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
        } else {
            return fallbackCopy(text);
        }

        function fallbackCopy(t) {
            try {
                const ta = document.createElement('textarea');
                ta.value = t;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return Promise.resolve(true);
            } catch (e) {
                return Promise.resolve(false);
            }
        }
    }

    function findInputElement() {
        for (const s of inputSelectors) {
            const el = document.querySelector(s);
            if (el) return el;
        }
        return null;
    }

    function trySendUsingButton() {
        for (const s of sendButtonSelectors) {
            const btn = document.querySelector(s);
            if (btn) { btn.click(); return true; }
        }
        return false;
    }

    function debounce(fn, wait) {
        let t = null;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function createButton(color, label, message, send = true) {
        const btn = document.createElement('button');
        btn.className = 'gtr-multi-btn';
        btn.textContent = label;
        btn.style.cssText = `margin-left:6px;padding:2px 6px;font-size:12px;border:none;border-radius:4px;cursor:pointer;background:${color};color:white;`;
        btn.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            const stationCode = (typeof message === 'string') ? message.split(' ')[0] : '';
            if (stationCode) {
                await safeCopyToClipboard(stationCode);
            }

            const inputDiv = findInputElement();
            if (!inputDiv) return;

            const fullText = message || stationCode || '';
            try {
                inputDiv.focus();
                inputDiv.textContent = fullText;
                inputDiv.innerText = fullText;
                inputDiv.dispatchEvent(new InputEvent('input', { bubbles: true, data: fullText, inputType: 'insertText' }));
            } catch (err) { }

            if (send) {
                setTimeout(() => {
                    if (!trySendUsingButton()) {
                        const ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', which: 13, keyCode: 13 });
                        inputDiv.dispatchEvent(ev);
                    }
                }, 180);
            }
        });
        return btn;
    }

    function attachButtonsToMessageText(msgTextEl, stationCode, pattern) {
        if (!msgTextEl || !stationCode) return;
        if (msgTextEl.parentElement && msgTextEl.parentElement.querySelector && msgTextEl.parentElement.querySelector('.gtr-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'gtr-wrapper';
        wrapper.style.display = 'inline-flex';
        wrapper.style.gap = '6px';
        wrapper.style.marginTop = '4px';
        wrapper.style.alignItems = 'center';

        if (pattern) {
            if (pattern.gray) wrapper.appendChild(createButton('gray', pattern.grayLabel || 'Check', pattern.gray(stationCode)));
            if (pattern.green) wrapper.appendChild(createButton('green', pattern.greenLabel || 'GT Proceed', pattern.green(stationCode)));
            if (pattern.yellow) wrapper.appendChild(createButton('goldenrod', pattern.yellowLabel || 'GT C', pattern.yellow(stationCode)));
            if (pattern.red) wrapper.appendChild(createButton('crimson', pattern.redLabel || 'Incorrect', pattern.red(stationCode)));
            if (pattern.purple) wrapper.appendChild(createButton('purple', pattern.purpleLabel || 'Preff', pattern.purple(stationCode)));
        }

        if (ADD_CUSTOM_FALLBACK) wrapper.appendChild(createButton('blue', 'Custom', `${stationCode}`, false));

        try {
            const parent = msgTextEl.parentElement || msgTextEl;
            parent.appendChild(wrapper);
        } catch (e) {
            try { msgTextEl.appendChild(wrapper); } catch (err) { }
        }
    }

    function getMessageTextElement(container) {
        if (!container) return null;
        for (const sel of messageTextSelectors) {
            try {
                const found = container.querySelector(sel);
                if (found) return found;
            } catch (e) { }
        }
        for (const sel of messageTextSelectors) {
            try { if (container.matches && container.matches(sel)) return container; } catch (e) { }
        }
        const candidates = Array.from(container.querySelectorAll('div, span')).filter(el => {
            const t = (el.innerText || '').trim();
            return t.length >= 3 && t.length <= 200 && t.split(' ').length <= 20;
        });
        return candidates.length ? candidates[0] : null;
    }

    function processContainer(container) {
        if (!container) return;
        const msgTextEl = getMessageTextElement(container);
        if (!msgTextEl) return;

        let rawText = (msgTextEl.innerText || '').trim();
        if (!rawText) return;

        const normalized = rawText.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
        try { if (container.dataset && container.dataset.gtrText === normalized) return; if (container.dataset) container.dataset.gtrText = normalized; } catch (e) { }

        for (const pattern of patterns) {
            try {
                const m = normalized.match(pattern.regex);
                if (m && m[1]) {
                    attachButtonsToMessageText(msgTextEl, m[1], pattern);
                    return;
                }
            } catch (err) { }
        }

        if (ADD_CUSTOM_FALLBACK) {
            const fb = normalized.match(STATION_CODE_REGEX);
            if (fb && fb[1]) attachButtonsToMessageText(msgTextEl, fb[1], null);
        }
    }

    function scanAllMessages() {
        const selector = messageContainerSelectors.join(',');
        let nodes;
        try { nodes = document.querySelectorAll(selector); } catch (e) { nodes = document.querySelectorAll('[role="listitem"]'); }
        nodes.forEach(n => processContainer(n));
    }

    const debouncedFullScan = debounce(() => { try { scanAllMessages(); } catch (e) { } }, 250);

    function startDomObserver() {
        const observer = new MutationObserver((mutations) => {
            let added = 0;
            for (const mut of mutations) {
                if (mut.addedNodes && mut.addedNodes.length) {
                    mut.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        for (const sel of messageContainerSelectors) {
                            try {
                                if (node.matches && node.matches(sel)) { processContainer(node); added++; }
                                const inner = node.querySelectorAll && node.querySelectorAll(sel);
                                if (inner && inner.length) inner.forEach(ic => { processContainer(ic); added++; });
                            } catch (e) { }
                        }
                        for (const sel of messageTextSelectors) {
                            try {
                                if (node.matches && node.matches(sel)) processContainer(node);
                                const innerTextEls = node.querySelectorAll && node.querySelectorAll(sel);
                                if (innerTextEls && innerTextEls.length) innerTextEls.forEach(el => processContainer(el.closest ? el.closest(messageContainerSelectors[0]) || el.parentElement || el : el));
                            } catch (e) { }
                        }
                    });
                }
                if (mut.type === 'characterData' && mut.target && mut.target.parentElement) processContainer(mut.target.parentElement.closest ? mut.target.parentElement.closest(messageContainerSelectors.join(',')) : mut.target.parentElement);
            }
            if (added > 0) debouncedFullScan();
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    let fallbackInterval = null;
    function startFallbackScanner() {
        if (fallbackInterval) return;
        fallbackInterval = setInterval(() => { try { scanAllMessages(); } catch (e) { } }, 3000);
    }

    function waitForSlackAndStart(retries = 0) {
        const candidate = document.querySelector('[role="presentation"] [role="list"], [data-qa="message_container"], [data-qa="virtual-list"], [aria-label="Messages"]');
        if (!candidate && retries < 60) { setTimeout(() => waitForSlackAndStart(retries + 1), 500); return; }
        setTimeout(() => { try { scanAllMessages(); startDomObserver(); startFallbackScanner(); console.log(`GTR v${VERSION} started.`); } catch (e) { } }, 500);
    }

    (function injectStyles() {
        const s = document.createElement('style');
        s.textContent = `
            .gtr-multi-btn:hover { opacity: 0.9; transform: scale(1.04); transition: transform .07s; }
            .gtr-wrapper { display:inline-flex; gap:6px; margin-top:4px; align-items:center; }
        `;
        document.head.appendChild(s);
    })();

    waitForSlackAndStart();

})();

