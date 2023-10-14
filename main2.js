var db = openDatabase("MedSoft", "0.1", "MedSoft Users", 200000);

db.transaction(function (tx) {
    tx.executeSql('SELECT rowid, name, adress, number, helpReason FROM users', [], function (tx, results) {
        var userTableBody = document.getElementById('user-table-body');

        for (var i = 0; i < results.rows.length; i++) {
            var user = results.rows.item(i);

            // Создаем новую строку в таблице
            var row = document.createElement('tr');
            row.innerHTML = '<td>' + user.rowid + '</td>' +
                            '<td>' + user.adress + '</td>' +
                            '<td>' + user.name + '</td>' +
                            '<td>' + user.number + '</td>' +
                            '<td>' + user.helpReason + '</td>';
            // Добавляем строку в тело таблицы
            userTableBody.appendChild(row);
        }
    });
});
