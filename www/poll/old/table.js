define([
    '/bower_components/jquery/dist/jquery.min.js',
],function () {
    var $ = window.jQuery;

    var Table = function ($t, xy) {
        var $head = $t.find('thead');
        var $body = $t.find('tbody');
        var $foot = $t.find('tfoot');

        var rows = [];
        var cols = [];

        var addRow = function (first, Rest, uid) {
            var $row = $('<tr>', {
                'data-rt-uid': uid,
            }).append($('<td>').append(first));

            $head.find('th').each(function (i) {
                var colId = $(this).data('rt-uid');
                $row.append($('<td>', {
                    'class': 'checkbox-cell',
                }).append(Rest(xy(colId, uid))));
            });

            rows.push(uid);

            $body.append($row);
            return $row;
        };

        var addColumn = function (first, Rest, uid) {
            $head.find('tr').append($('<th>', {
                'data-rt-uid': uid,
            }).append(first));

            var $width = $body.find('tr').each(function (i) {
                // each checkbox needs a uid corresponding to its role
                var rowId = $(this).data('rt-uid');
                $(this).append($('<td>', {
                    'class': 'checkbox-cell',
                }).append(Rest(xy(uid, rowId))));
            });

            cols.push(uid);

            $foot.find('tr').append($('<td>', { }));
            return $width.length;
        };

        var remove = function ($sel) {
            $sel.fadeOut(750, function () {
                $sel.remove();
            });
        };

        var removeFromArray = function (A, e) {
            var i = A.indexOf(e);
            if (i === -1) { return; }
            A.splice(i, 1);
        };

        var removeColumn = function (uid) {
            //var I/
            var $col = $head.find('th[data-rt-uid="' + uid + '"]');
            if (!$col.length) { return; }

            /*  removing a column is difficult because the elements
                all have different parents.  */

            // use the th
            var th = $col[0];

            // find its index in the tr
            var index = Array.prototype.slice
                .call(th.parentElement.children).indexOf(th);

            // remove it
            remove($col);

            removeFromArray(cols, uid);

            // remove all elements in the body which have the same index
            $body.find('tr').each(function () {
                var $this = $(this);
                $this.find('td').eq(index).each(function () {
                    remove($(this));
                });
            });
        };

        var removeRow = function (uid) {
            var $row = $body.find('tr[data-rt-uid="' + uid + '"]');
            if (!$row.length) { return; }
            remove($row);
            removeFromArray(rows, uid);
        };

        var colExists = function (uid) {
            return cols.indexOf(uid) !== -1;
        };

        var rowExists = function (uid) {
            return rows.indexOf(uid) !== -1;
        };

        return {
            $: $t,
            addRow: addRow,
            addColumn: addColumn,
            removeRow: removeRow,
            removeColumn: removeColumn,
            rows: rows,
            rowExists: rowExists,
            cols: cols,
            colExists: colExists,
        };
    };
    return Table;
});
