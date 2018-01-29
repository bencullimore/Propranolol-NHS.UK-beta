/**
* TITLE:
* @component: Table of Contents
*
* AUTHOR:
* Citizens Advice: Front-end
*
* DESCRIPTION:
* Populating Table of contents:
* TOC will be added if the advisor is logged in
*
* README:
*
*
* API:
*
*
*/

'use strict';

$(document).ready(function () {

    var TableOfContents = (function () {

        var tocItems = $('h2 .ref-heading__heading');
        var tocItemsID = $('h2.ref-heading');
        var adviceContent = $('.articleContent');
        var advisorLogin = ($('input[name*="astat"]').val());
        var tocArray = [];
        var tocList;

        function addingToTOC(text, id) {
            $.each(text, function (i, item) {
                var tempObj = {
                    id: id[i].id,
                    content: item.textContent
                };
                tocArray.push(tempObj);
            });
        };

        function populateTOC() {
            var tempItems = '';
            addingToTOC(tocItems, tocItemsID);
            if (tocArray.length >= 1) {
                tocArray.forEach(function (item) {
                    tempItems += '<li><a href=#' + item.id + '>' + item.content + '</a></li>';
                });
                return tocList = (
                    '<div class="well tertiary">' +
                    '<h5> On this page </h5>' +
                    '<ul class="ul--column">' +
                    tempItems +
                    '</ul>' +
                    '</div>'
                );
            }
        };

        function renderList() {
            if (advisorLogin === 'True') {
                populateTOC();
                $(adviceContent).prepend(tocList);
            }
        }

        function createColumns(columnContainerClass, columnClass, numColumns) {
            var total = $("." + columnClass + " li").size();
            var count = Math.ceil(total / numColumns);
            var column = 0;

            for (var i = 0; i < total; i += count) {
                column++;

                $("." + columnContainerClass).append(
                    '<ul class="' + columnClass + '--' + column + '"></ul>'
                );

                $("." + columnClass + "--" + column).html(
                    $("." + columnClass + " li").splice(0, count)
                );
            }

            $("." + columnClass).remove();
        }




        return {
            render: renderList,
            splitColumns: createColumns
        }

    })();

    TableOfContents.render(); //This will return a list of all the Titles in a Div
    TableOfContents.splitColumns('well', 'ul--column', 2);

});