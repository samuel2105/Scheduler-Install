// ==UserScript==
// @name         Universal Station Copy Button - Custom Label
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Bottom-right button to copy station code + space with custom label, no copied feedback
// @author       samumzz
// @match        https://na.route.planning.last-mile.a2z.com/route-planning/*
// @match        https://na.dispatch.planning.last-mile.a2z.com/route-constraints*
// @match        https://na.assignment.planning.last-mile.a2z.com/assignment-planning*
// @match        https://na.dispatch.planning.last-mile.a2z.com/dispatch-planning*
// @match        https://routingtools-na.amazon.com/clusterTransfer.jsp?stationCode=*
// @match        https://logistics.amazon.com/station/dashboard/inductManagement?stationCode=*
// @match        https://na.sort.planning.last-mile.a2z.com/*
// @match        https://sort-planning.amazon.com/sort-planning*
// @match        https://routingtools-na.amazon.com/amxl/clusterTransfer.jsp?stationCode=*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_LABEL = "Custom Msg";  // <-- 🖊️ Change this text to your desired button label

    function getStationCode() {
        const url = window.location.href;
        const urlMatch = url.match(/stationCode=([A-Z0-9]{4})/i);
        if (urlMatch) return urlMatch[1];

        const regex = /\b[A-Z]{3}[0-9]\b/;
        const elements = document.querySelectorAll('body *');
        for (let el of elements) {
            if (el.innerText && regex.test(el.innerText)) {
                const match = el.innerText.match(regex);
                if (match) return match[0];
            }
        }
        return null;
    }

    function createCopyButton(stationCode) {
        const btn = document.createElement('button');
        btn.innerText = BUTTON_LABEL;
        btn.style.position = 'fixed';
        btn.style.bottom = '75px';
        btn.style.left = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = 'gray';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.opacity = '0.9';

        btn.addEventListener('click', () => {
            GM_setClipboard(stationCode + ' ');
        });

        document.body.appendChild(btn);
    }

    function waitForPageAndRun() {
        const interval = setInterval(() => {
            const code = getStationCode();
            if (code) {
                createCopyButton(code);
                clearInterval(interval);
            }
        }, 1000);

        setTimeout(() => clearInterval(interval), 15000);
    }

    waitForPageAndRun();
})();
