// ==UserScript==
// @name         TikTokBC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An extension for the Tiktok site that makes the time spent on the site even better.
// @author       beastcom
// @match        https://www.tiktok.com/
// ==/UserScript==

(function () {
    'use strict';
    // CSS for the menu
    const style = document.createElement('style');
    style.textContent = `
        #draggable-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background-color: #fff;
            color: #000;
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
            cursor: move;
        }
    `;
    document.head.appendChild(style);

    // HTML for the menu
    const menu = document.createElement('div');
    menu.id = 'draggable-menu';
    menu.textContent = 'TikTokBC';
    document.body.appendChild(menu);

    // Make the menu draggable
    menu.onmousedown = function(event) {
        let shiftX = event.clientX - menu.getBoundingClientRect().left;
        let shiftY = event.clientY - menu.getBoundingClientRect().top;

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            menu.style.left = pageX - shiftX + 'px';
            menu.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        menu.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            menu.onmouseup = null;
        };

    };

    menu.ondragstart = function() {
        return false;
    };
})();
