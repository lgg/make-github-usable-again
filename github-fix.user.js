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
        getArrayFromNodeList: function (nodeList) {
            if (NodeList.prototype.isPrototypeOf(nodeList)) {
                return Array.from(nodeList);
            }

            if (Array.isArray(nodeList)) {
                return nodeList;
            }

            return [nodeList]
        },
        callForAll: function (elements, func) {
            for (let i = 0; i < elements.length; i++) {
                func(elements[i], i);
            }
        },
        getById: (id) => {
            return document.getElementById(id);
        },
        getByClass: (className) => {
            return document.getElementsByClassName(className);
        },
        hide: function (el) {
            el = this.getArrayFromNodeList(el);
            el.forEach((currentEl) => {
                this.addStyle(currentEl, 'display: none !important;')
            });
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
        addStyle: function (el, css) {
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

    // github markup related functions
    const github = {
        getHeaderBlockTitle: (parent) => {
            try {
                const blockTitles = parent.querySelectorAll('h2');

                // check if it have title block (not empty block or not hidden block)
                if (blockTitles.length === 0) {
                    return false;
                }
                const blockTitle = blockTitles[0];

                // check if title is not a link
                if (blockTitle.children.length === 0) {
                    return blockTitle.textContent.trim();
                }

                // get block title links
                const titleLinks = blockTitle.querySelectorAll('a');
                if (titleLinks.length === 0) {
                    // something go wrong
                    return false;
                }

                const titleLink = titleLinks[0];
                return titleLink.childNodes[0].nodeValue.trim();
            } catch (e) {
                return false;
            }
        },
        hideTitleBlock: function (el) {
            dom.hide(el.querySelectorAll('h2'));
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
        dom.addClass(aboutBlock, 'col-md-12 mb-3');
        const aboutBlockInner = aboutBlock.children[0];
        dom.removeClass(aboutBlockInner, 'BorderGrid-cell');
        dom.addClass(aboutBlockInner, 'col-md-12');
        github.hideTitleBlock(aboutBlockInner);


        // @TODO: fix about block (beautify)

        // if we have external repo link - move it to about text block as inline-child
        const aboutBlockExternalLinks = aboutBlock.querySelectorAll('.d-flex');
        if (aboutBlockExternalLinks.length > 0) {
            const aboutBlockExternalLink = aboutBlockExternalLinks[0];
            const aboutTextBlock = aboutBlockExternalLink.previousElementSibling;

            let inlineAboutBlockExternalLink = document.createElement('span');
            inlineAboutBlockExternalLink.innerHTML = aboutBlockExternalLink.innerHTML;

            dom.removeElement(aboutBlockExternalLink);
            aboutTextBlock.appendChild(inlineAboutBlockExternalLink);
            dom.addStyle(inlineAboutBlockExternalLink, 'margin-left: 10px;');
        }

        let aboutBlockLastChild = dom.getLastChild(aboutBlockInner);
        let aboutBlockLeftLastChild = aboutBlockLastChild.previousElementSibling;
        let licenseBlock = false;

        if (aboutBlockLeftLastChild.textContent === 'License') {
            licenseBlock = aboutBlockLastChild.children[0].cloneNode(true);
            dom.removeElement(aboutBlockLastChild);
            dom.removeElement(aboutBlockLeftLastChild);
        }

        // if we have "Readme" link - delete it
        aboutBlockLastChild = dom.getLastChild(aboutBlockInner);
        aboutBlockLeftLastChild = aboutBlockLastChild.previousElementSibling;
        if (aboutBlockLeftLastChild.textContent === 'Resources') {
            dom.removeElement(aboutBlockLastChild);
            dom.removeElement(aboutBlockLeftLastChild);
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

        // get remaining rest header blocks
        const remainingHeaderBlocks = repoHeader.getElementsByClassName('BorderGrid-row');
        for (let j = 0; j < remainingHeaderBlocks.length; j++) {
            let currentBlockName = github.getHeaderBlockTitle(remainingHeaderBlocks[j]);
            if (currentBlockName) {
                const currentBlock = remainingHeaderBlocks[j];


                // @TODO: contributors and Used by in one row

                // @TODO: Sponsor block in one row
                switch (currentBlockName) {
                    // @TODO: move Packages and Releases block between branch and btns
                    case 'Releases':
                        break;
                    case 'Packages':
                        break;
                    case 'Sponsor this project':
                        break;
                    case 'Used by':
                        break;
                    case 'Contributors':
                        break;
                    case 'Languages':
                        const languageBlock = currentBlock;

                        if (languageBlock.querySelectorAll('.Progress').length > 0) {
                            dom.addClass(languageBlock, 'col-md-12');
                            dom.removeClass(languageBlock, 'BorderGrid-row');

                            dom.addClass(languageBlock.children[0], 'col-md-12');
                            dom.removeClass(languageBlock.children[0], 'BorderGrid-cell');

                            github.hideTitleBlock(languageBlock);
                        }
                        break;
                }
            }
        }

        // @TODO: fix last commit date (make it more visible)

        //##############################################################################################

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
