// ==UserScript==
// @name         Workstation(Qbar) Station Code Copier
// @namespace    samumzz
// @version      1.1
// @description  Adds GT P ? and GT C ? buttons using station code from input field (e.g., DHX1)
// @author       Samuel Sumanth M
// @match        https://na.coworkassignment.science.last-mile.a2z.com/Scheduling/Workstation*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    let lastStationCode = '';
    let buttonContainer = null;

    function createButtons(stationCode) {
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.bottom = '20px';
            buttonContainer.style.left = '50%';
            buttonContainer.style.transform = 'translateX(-50%)';
            buttonContainer.style.zIndex = '9999';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '12px';
            buttonContainer.style.padding = '10px 20px';
            buttonContainer.style.background = '#f9f9f9';
            buttonContainer.style.border = '1px solid #ccc';
            buttonContainer.style.borderRadius = '12px';
            buttonContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            document.body.appendChild(buttonContainer);
        }

        buttonContainer.innerHTML = '';

        const makeButton = (label, suffix) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.padding = '8px 14px';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.background = '#007bff';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '8px';
            btn.style.transition = 'transform 0.1s ease';
            btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => {
                GM_setClipboard(`${stationCode} ${suffix}`);
            };
            return btn;
        };

        buttonContainer.appendChild(makeButton('GT P ?', 'GT P ?'));
        buttonContainer.appendChild(makeButton('GT C ?', 'GT C ?'));
        buttonContainer.appendChild(makeButton('Custom', ' '));
    }

    function getStationCodeFromInput() {
        const input = document.querySelector('input[placeholder="Station Code"]');
        if (input && input.value.trim().length === 4) {
            return input.value.trim().toUpperCase();
        }

        // Fallback: check the first input box (as per your screenshot)
        const backup = document.querySelectorAll('input[type="text"]')[0];
        if (backup && backup.value.trim().length === 4) {
            return backup.value.trim().toUpperCase();
        }

        return null;
    }

    setInterval(() => {
        const stationCode = getStationCodeFromInput();
        if (stationCode && stationCode !== lastStationCode) {
            lastStationCode = stationCode;
            createButtons(stationCode);
        }
    }, 1000);
})();
