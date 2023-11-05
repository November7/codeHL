// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * CodeHighlighter for TinyMCE.
 *
 * @module      tiny_codehighlighter/ui
 * @copyright   2023 Nov <m.kowalski.nov7@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
import LinkModal from './modal';

/**
 * Handle action.
 *
 * @param {TinyMCE} editor
 */

export const handleAction = (editor) => {
    displayDialogue(editor);
    window.console.log("works...");
};

/**
 * displayDialogue.
 *
 * @param {TinyMCE} editor
 * @returns {Promise<void>}
 */
const displayDialogue = async(editor) => {
    let data = {};
    const modalPromises = await ModalFactory.create({
        type: LinkModal.TYPE,
        templateContext: getTemplateContext(editor,data),
        large: false,
    });

    modalPromises.show();
    const $root = await modalPromises.getRoot();

    $root.on(ModalEvents.hidden, () => {
        modalPromises.destroy();
    });
};

/**
 * getTemplateContext.
 *
 * @param {TinyMCE} editor
 * @param {Object} data
 * @returns {Object}
 */

const getTemplateContext = (editor,data) => {

    return Object.assign({}, {
        elementid: editor.id,
    }, data);
};
