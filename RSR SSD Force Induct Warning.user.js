// ==UserScript==
// @name         RSR SSD Force Induct Warning
// @namespace    samumzz.forceinduct.warning
// @version      1.0
// @description  ⚠️ Displays a warning popup on the Induct Management dashboard to prevent RSR SSD force induct actions
// @author       samumzz (Samuel Sumanth M)
// @match        https://logistics.amazon.com/station/dashboard/inductManagement*
// @grant        none
// @downloadURL  https://github.com/samuel2105/Scheduler-Install/raw/main/RSR%20SSD%20Force%20Induct%20Warning.user.js
// @updateURL    https://github.com/samuel2105/Scheduler-Install/raw/main/RSR%20SSD%20Force%20Induct%20Warning.user.js
// ==/UserScript==

(function() {
    'use strict';

    function showWarningPopup() {
        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FFD700;  /* Yellow background */
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            width: 550px;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 3px solid #000000;
        `;

        // Warning icon
        const warningIcon = document.createElement('div');
        warningIcon.innerHTML = '⚠️';
        warningIcon.style.cssText = `
            font-size: 60px;
            margin-bottom: 20px;
        `;

        // Warning message
        const message = document.createElement('div');
        message.style.cssText = `
            text-align: center;
            margin: 20px 0;
            padding: 0 20px;
        `;

        // Message content with black bold text
        message.innerHTML = `
            <div style="
                font-size: 38px;
                font-weight: 900;
                line-height: 1.5;
                margin-bottom: 20px;
                font-family: Arial Black, Arial, sans-serif;
            ">
                <div style="color: #000000;">DO NOT OPEN</div>
                <div style="color: #000000;">FORCE INDUCT</div>
                <div style="color: #000000;">FOR RSR SSD TASK</div>
            </div>
        `;

        // OK button
        const button = document.createElement('button');
        button.textContent = 'OK';
        button.style.cssText = `
            background: #000000;
            color: white;
            border: none;
            padding: 15px 70px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 22px;
            font-weight: bold;
            margin-top: 30px;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;

        // Button hover effects
        button.onmouseover = function() {
            this.style.backgroundColor = '#333333';
            this.style.transform = 'scale(1.05)';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#000000';
            this.style.transform = 'scale(1)';
        };

        // Dark overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add elements to modal
        modal.appendChild(warningIcon);
        modal.appendChild(message);
        modal.appendChild(button);

        // Add modal to overlay
        overlay.appendChild(modal);

        // Add overlay to body
        document.body.appendChild(overlay);

        // Center modal on resize
        window.addEventListener('resize', function() {
            modal.style.top = '50%';
            modal.style.left = '50%';
        });

        // Close modal functions
        button.onclick = function() {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.onclick = function(e) {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        };

        // Add fade-in animation
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 0);
    }

    // Show popup when page loads
    window.addEventListener('load', function() {
        setTimeout(showWarningPopup, 500);
    });
})();
