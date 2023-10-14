const db = openDatabase("MedSoft", "0.1", "MedSoft Users", 200000);

if(!db){alert("Failed to connect to database.");}

db.transaction(function (tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, adress TEXT, number TEXT, helpReason TEXT)');
})

document.getElementById('addEntry').addEventListener('click', function () {
    var userName = document.getElementById('user-name').value;
    var userNumber = document.getElementById('user-number').value;
    var userAdress = document.getElementById('user-adress').value;
    var userHelpReason = document.getElementById('user-help-reason').value;

    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO users (name, adress, number, helpReason) values(?, ?, ?, ?)', [userName, userAdress, userNumber, userHelpReason]);
        alert('Запись добавлена');
    });
});

db.transaction(function (tx) {
    tx.executeSql('SELECT rowid FROM users', [], function (tx, result) {
        
        let data = [];
        for (let i = 0; i < result.rows.length; i++) {
            let row = result.rows.item(i);
            data.push(row);
        }

        console.log(data);

        let firstIndex = data[0].rowid
        getDataForSelectedId(firstIndex)
        populateSelectOptions(firstIndex, data);
    });
});

function populateSelectOptions(firstIndex, idArray) {
    var select = document.getElementById('id-input');

    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for(let id of idArray){
        var option = document.createElement('option');
        option.value = id.rowid;
        option.text = id.rowid;
        select.appendChild(option);
    }
}


document.getElementById('id-input').addEventListener('change', function () {
    var selectedId = this.value;
    
    getDataForSelectedId(selectedId);
});

function getDataForSelectedId(selectedId) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM users WHERE rowid = ?', [selectedId], function (tx, result) {
            if (result.rows.length > 0) {
                var user = result.rows.item(0);
                console.log(user);
                
                document.getElementById('user-name').value = user.name;
                document.getElementById('user-adress').value = user.adress;
                document.getElementById('user-number').value = user.number;
                document.getElementById('user-help-reason').value = user.helpReason;
            } else {
                document.getElementById('user-name').value = '';
                document.getElementById('user-adress').value = '';
                document.getElementById('user-number').value = '';
                document.getElementById('user-help-reason').value = '';
            }
        });
    });
}

document.getElementById('deleteEntry').addEventListener('click', function () {
    var selectedId = document.getElementById('id-input').value;

    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM users WHERE rowid = ?', [selectedId], function () {
            alert('Запись успешно удалена');
            
            document.getElementById('user-name').value = '';
            document.getElementById('user-adress').value = '';
            document.getElementById('user-number').value = '';
            document.getElementById('user-help-reason').value = '';
        }, function (tx, error) {
            console.error('Ошибка при удалении записи:', error.message);
        });
    });
});

document.getElementById('clearForm').addEventListener('click', function () {
    document.getElementById('user-name').value = '';
    document.getElementById('user-adress').value = '';
    document.getElementById('user-number').value = '';
    document.getElementById('user-help-reason').value = '';
    document.getElementById('newProperty-name').value = '';
    document.getElementById('newProperty-value').value = '';
});

document.getElementById('addNewProperty').addEventListener('click', function () {
    var selectedId = document.getElementById('id-input').value;
    var newPropertyName = document.getElementById('newProperty-name').value;
    var newPropertyValue = document.getElementById('newProperty-value').value;

    db.transaction(function (tx) {
        tx.executeSql('ALTER TABLE users ADD ' + newPropertyName + ' TEXT', [], function(tx, result) {
            alert('Новый столбец успешно добавлен.');

            db.transaction(function (tx2) {
                tx2.executeSql('UPDATE users SET ' + newPropertyName + ' = ? WHERE rowid = ?', [newPropertyValue, selectedId], function(tx2, result) {
                    alert('Значение успешно записано в новый столбец.');
                }, function(tx2, error) {
                    alert('Ошибка при записи значения в новый столбец: ' + error.message);
                });

            });
        }, function(tx, error) {
            alert('Ошибка при добавлении нового столбца: ' + error.message);
        });
    });
});

document.getElementById('printAll').addEventListener('click', function () {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM users WHERE helpReason IS NOT NULL AND helpReason != ""', [], function(tx, result) {
            if (result.rows.length > 0) {
                const names = [];
                for (var i = 0; i < result.rows.length; i++) {
                    names.push(result.rows.item(i).name);
                }
                
                document.getElementById('info').innerHTML = 'Нуждающиеся в помощи: ' + names.join(', ')
            } else {
                alert('Нет записей с непустым полем helpReason.');
            }
        }, function(tx, error) {
            alert('Ошибка при выполнении SQL-запроса: ' + error.message);
        });
    });
});
