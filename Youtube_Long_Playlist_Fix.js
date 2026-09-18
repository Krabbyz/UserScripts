// ==UserScript==
// @name         YouTube Long Playlist AutoPlay + Shuffle Fix
// @namespace    https://github.com/Krabbyz
// @version      1.0.0
// @description  Keeps large YouTube playlists autoplaying while respecting shuffle.
// @author       Austin Nguyen
// @homepageURL  https://github.com/Krabbyz/UserScripts
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @license      MIT
// ==/UserScript==

/*
 * YouTube Long Playlist AutoPlay + Shuffle Fix
 *
 * Created by Austin Nguyen
 *
 * Fixes an issue where large YouTube playlists may stop
 * autoplaying automatically after hundreds of videos.
 *
 * Uses YouTube's own Next button so Shuffle order is respected.
 */

(function () {
    'use strict';

    let currentVideo = null;
    let advancing = false;

    function log(...args) {
        console.log('[YT Playlist Fix]', ...args);
    }

    function getPlayer() {
        return document.querySelector('#movie_player');
    }

    function getVideo() {
        return document.querySelector('video.html5-main-video');
    }

    function getNextButton() {
        return document.querySelector('.ytp-next-button');
    }

    function isInPlaylist() {
        return new URLSearchParams(location.search).has('list');
    }

    function advanceToNextVideo() {
        if (!isInPlaylist() || advancing) {
            return;
        }

        const nextButton = getNextButton();

        if (!nextButton) {
            log('Next button not found.');
            return;
        }

        advancing = true;

        log('Video ended. Advancing to next playlist item.');

        nextButton.click();

        setTimeout(() => {
            advancing = false;
        }, 2000);
    }

    function attachToVideo() {
        const video = getVideo();

        if (!video || video === currentVideo) {
            return;
        }

        currentVideo = video;

        log('Attached to video.');

        video.addEventListener('ended', () => {
            setTimeout(() => {
                if (video === getVideo() && video.ended) {
                    advanceToNextVideo();
                }
            }, 750);
        });
    }

    setInterval(attachToVideo, 1000);

    document.addEventListener('yt-navigate-finish', () => {
        advancing = false;

        setTimeout(() => {
            attachToVideo();
        }, 500);
    });

    attachToVideo();
})();