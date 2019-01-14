/* global define, brackets, $ */
define(function () {
    "use strict";

    var EditorManager = brackets.getModule('editor/EditorManager'),
        $stampOut = $("<span class='epochhelper-label' />");

    $stampOut.appendTo("#status-info");

    function isHex(h) {
        var a = parseInt(h, 16);
        return (a.toString(16) === h.toLowerCase());
    }

    function showTimestamp(event, editor) {
        editor = editor || EditorManager.getActiveEditor();
        var inputtext = editor.getSelectedText(),
            assumption = "";

        if (inputtext.length === 0) {
            $stampOut.text("");
            return;
        }

        inputtext = inputtext.replace(/[`'"\s]+/g, '');
        if (inputtext.charAt(inputtext.length - 1) === "L") {
            inputtext = inputtext.slice(0, -1);
        }

        if (isNaN(inputtext)) {
            if (isHex(inputtext)) {
                inputtext = '0x' + inputtext;
            } else {
                $stampOut.text("");
                return;
            }
        }

        inputtext = inputtext * 1;
        if ((inputtext >= 100000000000000) || (inputtext <= -100000000000000)) {
            assumption = " (assuming microseconds)";
            inputtext = Math.round(inputtext / 1000);
        } else if ((inputtext >= 100000000000) || (inputtext <= -100000000000)) {
            assumption = " (assuming milliseconds)";
        } else {
            assumption = " (assuming seconds)";
            inputtext = (inputtext * 1000);
        }

        if (inputtext < -6857222400000) {
            assumption += " (pre-Gregorian!)";
        }

        $stampOut.text(new Date(inputtext).toISOString() + assumption);
    }

    function onEditorChange(event, current) {
        current.on("cursorActivity.statusbar", showTimestamp);
        showTimestamp(null, current);
    }

    EditorManager.on("activeEditorChange", onEditorChange);
});
