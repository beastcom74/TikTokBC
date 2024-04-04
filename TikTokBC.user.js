// ==UserScript==
// @name         TikTokBC
// @namespace    http://tampermonkey.net/
// @version      1.0f
// @description  Extension for TikTok site
// @author       beastcom
// @match        *://www.tiktok.com/*
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(async () => {
    var AlwaysActive = await GM_getValue('alwaysactive_page') == 'true'
    var RepaintElements = await GM_getValue('repaint_elements') == 'true'
    var RemoveUseless = await GM_getValue('removeuseless_elements') == 'true'

    if (document.readyState !== 'loading') TikTokBC(); else document.addEventListener('DOMContentLoaded', TikTokBC)

    async function TikTokBC() {
        if (!await GM_getValue('firstLaunch')) {
            alert('\nTo open the menu TikTokBC, press Insert on the TikTok website')
            GM_setValue('firstLaunch', 'yes')
        }

        if (AlwaysActive) Always_Active(true)
        if (RepaintElements) Repaint_Elements(true)
        if (RemoveUseless) Remove_Useless(true)
    }

    document.addEventListener("keyup", function (e) {
        if (e.key == "Insert") {
            const tiktokbc_check = document.querySelector('#mainmenu_style')

            if (tiktokbc_check) {
                document.querySelector('#tiktokbc-menu')?.toggleAttribute('hidden')
                return
            }

            document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="tiktokbc-menu" style="position: fixed; right: 15px; top: 70px;"></div>');
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<div><span class="tiktokbc-logo">TikTokBC</span><span id="tiktokbc-close-button">X</span></div>');
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<div style="border-top: 1px solid rgb(53, 54, 58); margin: 1px;"></div>');
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<div><label class="tiktokbc-checkbox"><input type="checkbox" id="alwaysactive_page"></input>Always active window</label></div>');
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<div><label class="tiktokbc-checkbox"><input type="checkbox" id="repaint_elements"></input>Repaint elements</label></div>');
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<div><label class="tiktokbc-checkbox"><input type="checkbox" id="removeuseless_elements"></input>Hide unnecessary buttons, inscriptions</label></div>')
            document.querySelector('#tiktokbc-menu').insertAdjacentHTML('beforeend', '<br/><button class="tiktokbc-button-save">Save</button>')

            pushCSS('#tiktokbc-menu {animation: 0.5s show ease; background-color: rgb(31 31 30 / 50%); position: fixed; backdrop-filter: blur(10px); z-index: 9999999; border-radius: 20px; width: 300px} @keyframes show {from {opacity: 0;} to {opacity: 1;}}' +
                '.tiktokbc-logo {font-size: 15px; color: rgb(123, 177, 255); margin-left: 120px; font-family: "Roboto"; -webkit-user-select: none; position: relative; top: 2px}' +
                '.tiktokbc-checkbox {font-size: 13px; margin: 5px; color: rgb(200 200 200); position: relative; top: 5px}' +
                '#tiktokbc-close-button {color: rgb(200 200 200); position: absolute; top: 2px; right: 10px; cursor: pointer; transition: 0.3s ease} #tiktokbc-close-button:hover {color: rgb(255, 255, 255)}' +
                '.tiktokbc-button-save {background: rgb(39 39 38 / 50%); color: rgb(200 200 200); border-radius: 5px; border: 1px solid rgb(79 79 78); margin: auto; display: flex; font-family: "Roboto"; font-size: 13px; cursor: pointer; margin-bottom: 5px; transition: 0.5s ease} .tiktokbc-button-save:hover {background: rgb(69 69 68 / 50%)}'
                , "mainmenu_style");
            pushCSS('@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap")');

            document.querySelector('#tiktokbc-close-button').addEventListener('click', () => document.querySelector('#tiktokbc-menu')?.toggleAttribute('hidden'));

            const checkbox1 = document.querySelector('#alwaysactive_page')
            const checkbox2 = document.querySelector('#repaint_elements')
            const checkbox3 = document.querySelector('#removeuseless_elements')

            checkbox1.checked = AlwaysActive
            checkbox2.checked = RepaintElements
            checkbox3.checked = RemoveUseless

            checkbox1.addEventListener('change', e => Always_Active(e.target.checked))
            checkbox2.addEventListener('change', e => Repaint_Elements(e.target.checked))
            checkbox3.addEventListener('change', e => Remove_Useless(e.target.checked))

            document.querySelectorAll('.tiktokbc-button-save').forEach(x => x.addEventListener('click', function () {
                GM_setValue('alwaysactive_page', checkbox1.checked ? 'true' : 'false')
                GM_setValue('repaint_elements', checkbox2.checked ? 'true' : 'false')
                GM_setValue('removeuseless_elements', checkbox3.checked ? 'true' : 'false')

                x.textContent = 'Settings saved'
                setTimeout(() => x.textContent = 'Save', 1000)
            }))

            DragMenu();
        }
    });

    function DragMenu() {
        const draggableWindow = document.querySelector('#tiktokbc-menu');
        let isDragging = false;
        let offsetX, offsetY;

        const onMouseDown = (e) => {
            isDragging = true;
            offsetX = e.clientX - draggableWindow.getBoundingClientRect().left;
            offsetY = e.clientY - draggableWindow.getBoundingClientRect().top;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            draggableWindow.style.left = (e.clientX - offsetX) + 'px';
            draggableWindow.style.top = (e.clientY - offsetY) + 'px';
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        draggableWindow.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    function Always_Active(enabled) {
        if (!enabled) {
            Object.defineProperty(document, "hidden", {
                configurable: true,
                enumerable: true,
                get() {
                    return document.visibilityState === "hidden";
                }
            });

            return
        }
        Object.defineProperty(document, "hidden", {
            configurable: true,
            get() {
                return false;
            },
        });
    }
    function Repaint_Elements(enabled) {
        if (!enabled) {
            document.querySelector('#paint')?.remove()
            return
        }
        pushCSS(".css-lg2ydv-PShowMoreText, .css-1847gtm-Button-StyledFollowButtonTux, .css-uou5c3-SpanIdentity, .css-1mc6yu2-DivPostButton, .css-111wj9f-DivPostButton, .css-1suycxx-DivPostButton {color: rgb(123, 177, 255) !important; border-color: rgb(123, 177, 255) !important}" +
            ".css-1uc6di1-ButtonIconContainer, .css-1g1i6o0-SupBadge, .css-m19yyn-DivContainer.e2ipgxl0, .css-12xzmck-DivSwitchWrapper, .css-dahjy1-DivVideoTagContainer {background: rgb(123, 177, 255) !important; color: rgb(0, 0, 0) !important}" +
            ".css-l3thyc-StyledTopArrow.e2ipgxl1, path[d^=' M453.0360107421'], button[aria-pressed='true'] .css-6jak4n-SpanIconWrapper > svg, .css-lcgx87-DivLikeWrapper-StyledLikeWrapper.ezxoskx1 > svg, .css-1tvtgfz-DivLikeIcon.ezxoskx2 > svg, .css-pfvupc-DivInputAreaContainer .public-DraftEditor-content, .css-1qkggn6-DivInputAreaContainer .public-DraftEditor-content, .css-1geqepl-InputElement, .css-13wenwg-InputElement {fill: rgb(123, 177, 255) !important; caret-color: rgb(123, 177, 255) !important}" +
            ".css-q8xq8t-DivTipWrapper {color: rgb(0, 0, 0) !important}" +
            ".css-1obmd97-Button-StyledFollowButtonTux, .css-1pcikqk-Button {background-color: rgb(123, 177, 255) !important; border-color: rgb(123, 177, 255) !important; color: rgb(0, 0, 0) !important}", "paint")
    }
    function Remove_Useless(enabled) {
        if (!enabled) {
            document.querySelector('#remove_useless')?.remove()
            return
        }
        pushCSS(".css-18e9sac-ButtonGetAppText, .css-1lepjzi-DivLinkContainer, .css-58kfjy-H4LinkListHeader, .css-ubixky-H4LinkListHeader, .css-24h4dh-DivEffectHouseEntranceContainer, .css-1hhoqzc-DivMentionButton, .css-965aro-DivMoreContainer, .css-a3jj4p-DivEmojiButton, .css-1rvr9ul-NavMainNavContainer, .css-labfmt-DivUserContainer::before, .css-1klbnj3-DivCopyLinkContainer.ehlq8k33" +
            ", li:has(a[href='/live']), li:has(a[href='/explore']), li:has(a[href='/friends']), li:has(a[href='/following']), li:has(a[data-e2e='nav-profile']), li:has(a[data-e2e='nav-foryou']), li[data-e2e='keyboard-shortcut-entrance'], li[data-e2e='feedback-entrance'], li[data-e2e='live-studio-entrance'], li[data-e2e='recharge-entrance'], li:has(path[d^='M9 11C9 8.23858']), div[data-e2e='browse-share-group'], .css-adnylo-DivShareActions, .css-xm2bgz-DivMentionButton, .css-kf05ch-DivEmojiButton, li:has(a[href^='https://www.tiktok.com/live/creators?enter_from=portrait&lang']) {display: none; !important}" +
            ".css-bt9hlt-DivWrapper {margin-top: -25px !important}", "remove_useless")
        waitSelector(".css-1lmt8q1-SpanCopyright").then(tiktok_copyrights => {
            tiktok_copyrights.innerHTML = "<span>TiktokBC: github.com/beastcom74/TikTokBC<br><br>© 2024 Tiktok.<br>All rights belong to the owners</span>";
        })
    }
    function pushCSS(value, id) {
        const style = document.head.appendChild(document.createElement('style'))
        style.textContent = value
        if (id) style.id = id
    }
    function waitSelector(selector, limit_data) {
        if (typeof selector !== 'string') return console.error('wait > selector:', typeof selector);
        if (limit_data?.container && !(limit_data.container instanceof HTMLElement)) return console.error('wait > container not HTMLElement:', limit_data.container);
        if (selector.includes(':has(') && !CSS.supports('selector(:has(*))')) return Promise.reject('CSS ":has()" unsupported');

        return new Promise(resolve => {
            const container = limit_data?.container || document.body || document.documentElement || document;
            const observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    const targetNode = mutation.target;
                    if (targetNode.matches && targetNode.matches(selector)) return resolve(targetNode);
                    const foundNode = targetNode.querySelector(selector);
                    if (foundNode) return resolve(foundNode);
                }
                if (document.readyState !== 'loading') {
                    const element = container.querySelector(selector);
                    if (element) resolve(element);
                }
            });

            observer.observe(container, { childList: true, subtree: true, attributes: true });

            if (limit_data?.stop_on_page_change) {
                let prevURL = location.href;
                window.addEventListener('transitionend', () => { if (prevURL !== location.href) observer.disconnect(); });
            }
        });
    }
})();
