// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const dom = {
        getById: (id) => {
            return document.getElementById(id);
        },
        getByClass: (className) => {
            return document.getElementsByClassName(className);
        },
        addClass: (el, className) => {
            className = className.split(' ');
            if (className.length > 0) {
                className.forEach((currentClass) => {
                    el.classList.add(currentClass);
                })
            } else {
                el.classList.add(className[0]);
            }
        },
        removeClass: (el, className) => {
            className = className.split(' ');
            if (className.length > 0) {
                className.forEach((currentClass) => {
                    el.classList.remove(currentClass);
                })
            } else {
                el.classList.remove(className[0]);
            }
        },
        setStyle: (el, css) => {
            el.setAttribute('style', css)
        },
        getStyle: (el) => {
            return el.getAttribute('style');
        },
        addStyle: (el, css) => {
            css = this.getStyle(el) + '; ' + css;
            el.setAttribute('style', css);
        },
        getLastChild: (el) => {
            return el.children[el.children.length - 1]
        },
        removeElement: (el) => {
            el.parentNode.removeChild(el);
        }
    };

    //repository-content

    if (dom.getByClass('repository-content').length > 0 && dom.getById('readme')) {
        const repositoryContainer = dom.getByClass('repository-content')[0];
        const repositoryWrap = repositoryContainer.children[1];
        const repoContent = repositoryWrap.children[0];
        const repoHeader = repositoryWrap.children[1];

        dom.removeClass(repoContent, 'col-md-9');
        dom.removeClass(repoHeader, 'col-md-3');

        dom.addClass(repoContent, 'col-md-12 container-lg');
        dom.addClass(repoHeader, 'col-md-12 container-lg');

        dom.setStyle(repositoryWrap, 'flex-direction: column-reverse !important');

        const repoHeaderInnerWrap = repoHeader.children[0];
        dom.removeClass(repoHeaderInnerWrap, 'BorderGrid BorderGrid--spacious');
        dom.addClass(repoHeaderInnerWrap, 'mb-3');

        //##############################################################################################
        // fix about block
        const aboutBlock = repoHeader.getElementsByClassName('BorderGrid-row')[0];
        dom.removeClass(aboutBlock, 'BorderGrid-row hide-sm hide-md');
        dom.addClass(aboutBlock, 'col-md-12');
        const aboutBlockInner = aboutBlock.children[0];

        let lastChild = dom.getLastChild(aboutBlockInner);
        let leftLastChild = lastChild.previousElementSibling;
        let licenseBlock = false;

        if (leftLastChild.textContent === 'License') {
            licenseBlock = lastChild.children[0].cloneNode(true);
            dom.removeElement(lastChild);
            dom.removeElement(leftLastChild);
        }

        // if we have "Readme" link - delete it
        lastChild = dom.getLastChild(aboutBlockInner);
        leftLastChild = lastChild.previousElementSibling;
        if (leftLastChild.textContent === 'Resources') {
            dom.removeElement(lastChild);
            dom.removeElement(leftLastChild);
        }

        // if we have License detail move it to header of the repo details
        if (licenseBlock) {
            const repoDetailsHeader = repoContent.getElementsByClassName('Details')[0];
            const repoDetailsHeaderList = repoDetailsHeader.getElementsByClassName('list-style-none')[0];
            let item = document.createElement('li');
            dom.addClass(item, 'ml-3 d-none d-md-block');
            item.appendChild(licenseBlock);
            repoDetailsHeaderList.appendChild(item);
        }

        // @TODO: move Packages and Releases block between branch and btns

        // @TODO: contributors and Used by in one row

        // @TODO: Sponsor block in one row

        // @TODO: fix about block (beautify)

        //##############################################################################################
        // check if we have languages block
        const languagesBlock = dom.getLastChild(repoHeaderInnerWrap);
        if (languagesBlock.children[0].children[1].children[0].classList.contains('Progress')) {
            dom.addClass(languagesBlock, 'col-md-12');
            dom.removeClass(languagesBlock, 'BorderGrid-row');

            dom.addClass(languagesBlock.children[0], 'col-md-12');
            dom.removeClass(languagesBlock.children[0], 'BorderGrid-cell');
        }

    } else {
        console.log('not found')
    }
})();

//@TODO: add readme
//@TODO: add auto-installation from github file
//@TODO: upload to teamperMonkey web storage
//@TODO: clear code (add arrays to dom methods)
//@TODO: add more comments
//@TODO: test without DarkReader/DarkGithub
//@TODO: test on other screen sizes
//@TODO: beaturify repo (add tags, License and etc)
//@TODO: write article to medium
//@TODO: write article to habr
//@TODO: write article to vc
//@TODO: write article to productHunt
