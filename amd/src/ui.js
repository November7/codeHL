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
// import {debounce} from 'core/utils';

/**
 * Handle action.
 *
 * @param {TinyMCE} editor
 */

export const handleAction = (editor) => {
    displayDialogue(editor);
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
        large: true,
    });

    modalPromises.show();
    const $root = await modalPromises.getRoot();

    $root.on(ModalEvents.hidden, () => {
        modalPromises.destroy();
    });


    let btn = document.getElementById('save_tiny_codehighlighter');
    let lan = document.getElementById('id_content_editor_tiny_codehihlighter_langugage');
    btn.addEventListener('click', () => {
        const item = document.getElementById('id_content_editor_tiny_codehighlighter');

        const getSelectedText = (e) => {
            if (e.selectedIndex === -1) {return null;}
            return e.options[e.selectedIndex].text;
        };

        let splitted = item.value.split(/\r?\n/);
        let lineNumbers = "", codeLines = "";
        let lineNumer = 1;
        let content = "";
        content += '<div class="codehl">';
        content += '<div class="chLang_'+lan.value+' chParser_JS" style="width: 95%;"';// data-language="cpp" ';
        content += 'data-parser="JS" data-mce-style="width: 95%;">';
        content += '<table class="normal mce-item-table"><thead><tr><th colspan="2"><span class="title"></span>';
        content += '<span class="language">CodeHL 3.0 [pre-alpha] <b>['+getSelectedText(lan);
        content +=']</b></span></th></tr></thead><tbody><tr><td>';

        window.console.log("Language "+lan.value);

        for(let el in splitted)
        {
            lineNumbers += "<pre>"+(lineNumer++)+"</pre>";
            codeLines += "<pre>"+splitted[el]+"</pre>";
        }
        content += lineNumbers;
        content += '</td><td>';
        content += codeLines;
        content += '</td></tr></tbody></table></div></div>';

        editor.insertContent(content);
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
