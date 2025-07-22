// ==UserScript==
// @name         Schedular Blurb Creator
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add custom buttons for Route Planning, Route Constraints, Assignment Planning, Dispatch Planning, Cluster Transfer, Induct Management, Sort Planning, and AMXL Cluster Transfer pages
// @author       Samuel Sumanth M (samumzz)
// @match        https://na.route.planning.last-mile.a2z.com/route-planning/*
// @match        https://na.dispatch.planning.last-mile.a2z.com/route-constraints/*
// @match        https://na.assignment.planning.last-mile.a2z.com/assignment-planning/*
// @match        https://na.dispatch.planning.last-mile.a2z.com/dispatch-planning/*
// @match        https://routingtools-na.amazon.com/clusterTransfer.jsp?stationCode=*
// @match        https://logistics.amazon.com/station/dashboard/inductManagement?stationCode=*
// @match        https://na.sort.planning.last-mile.a2z.com/*
// @match        https://na.amxl.planning.last-mile.a2z.com/cluster-transfer/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    function extractXXXX(pageType) {
        const regexMap = {
            'route-planning': /\/route-planning\/([A-Za-z0-9]{4})\//,
            'route-constraints': /\/route-constraints\/([A-Za-z0-9]{4})\//,
            'assignment-planning': /\/assignment-planning\/([A-Za-z0-9]{4})/,
            'dispatch-planning': /\/dispatch-planning\/([A-Za-z0-9]{4})\//,
            'cluster-transfer': /stationCode=([A-Za-z0-9]{4})/,
            'induct-management': /stationCode=([A-Za-z0-9]{4})/,
            'sort-planning': /\/([A-Za-z0-9]{4})\//,
            'amxl-cluster-transfer': /\/cluster-transfer\/([A-Za-z0-9]{4})/
        };
        const regex = regexMap[pageType];
        const match = (pageType === 'cluster-transfer' || pageType === 'induct-management')
            ? window.location.search.match(regex)
            : window.location.pathname.match(regex);
        return match ? match[1] : '';
    }

    function createButton({ text, textToCopy, color, top, shake = false }) {
        const button = document.createElement('button');
        button.innerText = text;
        Object.assign(button.style, {
            position: 'fixed',
            left: '10px',
            top: top,
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: color,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '1000',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            letterSpacing: '2px',
            textShadow: '0px 0px 15px rgba(255, 255, 255, 0.7)'
        });

        if (shake) {
            setInterval(() => {
                button.style.animation = 'shake 4s ease-in-out';
                setTimeout(() => { button.style.animation = ''; }, 4000);
            }, 15000);
        }

        button.addEventListener('mouseover', () => { button.style.transform = 'scale(1.1)'; });
        button.addEventListener('mouseout', () => { button.style.transform = 'scale(1)'; });
        button.addEventListener('click', () => { GM_setClipboard(textToCopy); });

        document.body.appendChild(button);
    }

    function createButtonsForSortPlanning(xxxx) {
        [
            { text: 'Auditor Blurb', textToCopy: `${xxxx} x Sort planning Closed.. :lock: :lock:`, color: '#27ae60', top: '55%' },
            { text: 'Station Blurb', textToCopy: `${xxxx} x Cycles Sort planner has been Closed as requested `, color: '#e74c3c', top: '60%' },
            { text: 'All cycles closed - Audidto ', textToCopy: `${xxxx} All cycles are in closed status `, color: '#f1c40f', top: '65%' },
            { text: 'All cycles closed - station ', textToCopy: `${xxxx} All cycles are in closed status `, color: '#e67e22', top: '70%' },
        ].forEach(createButton);
    }

    function createButtonsForRoutePlanning(xxxx) {
        [
            { text: 'GT R 🏃 ?', textToCopy: `${xxxx} GT R ?`, color: '#27ae60', top: '55%' },
            { text: 'GT DPO 🚚 ?', textToCopy: `${xxxx} GT DPO ?`, color: '#f1c40f', top: '60%' },
            { text: 'GT AA 📝 , DPO 🚚 ?', textToCopy: `${xxxx} GT AA, DPO ?`, color: '#9b59b6', top: '65%' },
            { text: 'GT AA 📝 , DSP DPO 🚚 ?', textToCopy: `${xxxx} GT AA,DSP DPO ?`, color: '#3498db', top: '70%' },
            { text: 'Vol Var... 💀', textToCopy: `${xxxx} Vol Var..:gr-redalert::gr-redalert:`, color: '#e74c3c', top: '75%', shake: true },
            { text: 'GT Re-Plan 🔁 🔁  ?', textToCopy: `${xxxx} GT Re-Plan ?`, color: '#e67e22', top: '80%' }
        ].forEach(createButton);
    }

    function createButtonsForRouteConstraints(xxxx) {
        [
            { text: `No Nursery's....?`, textToCopy: `${xxxx} No Nursery's ?`, color: '#e74c3c', top: '50%' },
            { text: `GT R 🏃 ?`, textToCopy: `${xxxx} GT R ?`, color: '#9b59b6', top: '55%' }
        ].forEach(createButton);
    }

    function createButtonsForAssignmentPlanning(xxxx) {
        [
            { text: 'AA partially GT G ?', textToCopy: `${xxxx} AA partially completed GT G ?`, color: '#f1c40f', top: '55%' },
            { text: 'AA Timed Out..', textToCopy: `${xxxx} AA Timed Out ?`, color: '#7f8c8d', top: '60%' },
            { text: "Unassigned DSP's ?", textToCopy: `${xxxx} Unassigned DSP's ?`, color: '#e74c3c', top: '65%' }
        ].forEach(createButton);
    }

    function createButtonsForDispatchPlanning(xxxx) {
        [
            { text: "UN-planned DSP'S ?", textToCopy: `${xxxx} X Un-planned DSP'S ?`, color: '#3498db', top: '55%' },
            { text: "UN-planned Flex's?", textToCopy: `${xxxx} X Un-planned Flex's ?`, color: '#9b59b6', top: '60%' }
        ].forEach(createButton);
    }

    function createButtonsForClusterTransfer(xxxx) {
        [
            { text: 'GT CT ?', textToCopy: `${xxxx} GT CT  ?`, color: '#9b59b6', top: '55%' },
            { text: "Addon's  GT CT into Sunrise ?", textToCopy: `${xxxx} Addon's  GT CT into Sunrise ?`, color: '#f39c12', top: '60%' },
            { text: "Addon's  GT CT into AM ?", textToCopy: `${xxxx} Addon's  GT CT into AM ?`, color: '#3498db', top: '65%' }
        ].forEach(createButton);
    }

    function createButtonsForInductManagement(xxxx) {
        [
            { text: 'GT G?', textToCopy: `${xxxx} GT G ?`, color: '#2ecc71', top: '60%' },
            { text: 'Induct not Found ?', textToCopy: `${xxxx} Induct option not found ?`, color: '#e74c3c', top: '65%' },
            { text: 'GT C?', textToCopy: `${xxxx} GT C ?`, color: '#6a2516', top: '70%' },
            { text: 'GT S?', textToCopy: `${xxxx} GT S ?`, color: '#473bbf', top: '75%' },
            { text: 'GT Deny?', textToCopy: `${xxxx} GT Deny No as Transporter/incorrect Transporter ?`, color: '#c72674', top: '80%' },
        ].forEach(createButton);
    }

    function createButtonsForAMXLClusterTransfer(xxxx) {
        [
            { text: `GT U  Inclusion`, textToCopy: `${xxxx} GT Uploaded AMXL_1 Inclusion ?`, color: '#27ae60', top: '55%' },
            { text: `GT U Exclusion`, textToCopy: `${xxxx} GT Uploaded AMXL_1 Exclusion ?`, color: '#e74c3c', top: '60%' },
            { text: `Station Blurb Exclusion`, textToCopy: `${xxxx} AMXL_1 Exclusion has been uploaded`, color: '#e74c3c', top: '65%' },
            { text: `Station Blurb Inclusion`, textToCopy: `${xxxx} AMXL_1 Inclusion has been uploaded`, color: '#e74c3c', top: '70%' }
        ].forEach(createButton);
    }

    const currentURL = window.location.href;

    if (currentURL.includes('na.route.planning.last-mile.a2z.com/route-planning')) {
        const xxxx = extractXXXX('route-planning');
        if (xxxx) createButtonsForRoutePlanning(xxxx);
    }
    if (currentURL.includes('na.dispatch.planning.last-mile.a2z.com/route-constraints')) {
        const xxxx = extractXXXX('route-constraints');
        if (xxxx) createButtonsForRouteConstraints(xxxx);
    }
    if (currentURL.includes('na.assignment.planning.last-mile.a2z.com/assignment-planning')) {
        const xxxx = extractXXXX('assignment-planning');
        if (xxxx) createButtonsForAssignmentPlanning(xxxx);
    }
    if (currentURL.includes('na.dispatch.planning.last-mile.a2z.com/dispatch-planning')) {
        const xxxx = extractXXXX('dispatch-planning');
        if (xxxx) createButtonsForDispatchPlanning(xxxx);
    }
    if (currentURL.includes('routingtools-na.amazon.com/clusterTransfer.jsp')) {
        const xxxx = extractXXXX('cluster-transfer');
        if (xxxx) createButtonsForClusterTransfer(xxxx);
    }
    if (currentURL.includes('logistics.amazon.com/station/dashboard/inductManagement')) {
        const xxxx = extractXXXX('induct-management');
        if (xxxx) createButtonsForInductManagement(xxxx);
    }
    if (currentURL.includes('na.sort.planning.last-mile.a2z.com')) {
        const xxxx = extractXXXX('sort-planning');
        if (xxxx) createButtonsForSortPlanning(xxxx);
    }
    if (currentURL.includes('na.amxl.planning.last-mile.a2z.com/cluster-transfer')) {
        const xxxx = extractXXXX('amxl-cluster-transfer');
        if (xxxx) createButtonsForAMXLClusterTransfer(xxxx);
    }
})();
