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
 * @module      tiny_insertcode/ui
 * @copyright   2023 Nov <m.kowalski.nov7@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
import HighlighterModal from './modal';

// import {debounce} from 'core/utils';

/**
 * Handle action.
 *
 * @param {TinyMCE} editor
 */

export const handleAction = (editor) => {
    displayDialog(editor);
};

/**
 * displayDialog.
 *
 * @param {TinyMCE} editor
 * @returns {Promise<void>}
 */

const displayDialog = async(editor) => {
    const modal = await ModalFactory.create({
        type: HighlighterModal.TYPE,
        templateContext: Object.assign({}, {elementid: editor.id,}, {}),
        large: true,
    });
    modal.show();
    const $root = await modal.getRoot();


    let sel = editor.selection.getNode();
    let codeHLTag = getCodeHLTag(sel);
    if(codeHLTag && codeHLTag.querySelectorAll('TD')) {
        const item = document.getElementById('id_content_editor_tiny_insertcode');
        item.value = codeHLTag.querySelectorAll('TD')[1].innerText;
    }

    $root.on(ModalEvents.hidden, () => {
        modal.destroy();
    });

    $root.on(ModalEvents.save, () => {
        if(codeHLTag) {
            codeHLTag.remove();
        }
        insertCode(editor);
    });
};

/**
 * Get selected Code.
 * @param {HTMLElement} node
 * @returns {string}
 */

export const getCodeHLTag = (node) => {
    while(node && !node.classList.contains("codehl")) {node = node.parentElement;}
    return node;
};


/**
 * Handle insertion of a new equation, or update of an existing one.
 * @param {TinyMCE} editor
 */

export const insertCode = (editor) => {
    const item = document.getElementById('id_content_editor_tiny_insertcode');
    let lan = document.getElementById('id_content_editor_tiny_insertcode_langugage');
    const getSelectedText = (e) => {
        if (e.selectedIndex === -1) {return null;}
        return e.options[e.selectedIndex].text;
    };

    let splitted = item.value.split(/\r?\n/);
    let lineNumbers = "", codeLines = "";
    let lineNumer = 1;
    let content = "";
    content += '<div class="codehl chLang_'+lan.value+' chParser_JS">';
    content += '<table class="normal mce-item-table"><thead><tr><th colspan="2"><span class="title"></span>';
    content += '<span class="language"><b>['+getSelectedText(lan);
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
    content += '</td></tr></tbody>';
    content += '<tfoot><tr><td colspan="2"><small>InsertCode ver. 3.0.0</small></td></tr></tfoot>';
    content += '</table></div></div><br/>';

    editor.insertContent(content);
};