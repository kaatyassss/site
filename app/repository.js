const {readFileSync, stat, writeFile, writeFileSync} = require('fs');

module.exports = new function () {
    const fileName = "./data.json";
    let data = {};
    let increment = 0;
    this.create = dt => {
        dt.Id = increment++;
        data[dt.Id] = dt;
        writeFile(fileName, JSON.stringify(data), err => { //async выполняется после каждого синхронного,
                                                                // записываем несинхронно, чтобы не забивать стек когда не надо
            if (err) console.error(err)
        });
        return dt;
    }
    this.getAll = () => {
        return Object.values(data);
    }
    this.get = id => data[id];
    this.update = dt => {
        data[dt.Id] = dt;
        writeFile(fileName, JSON.stringify(data), err => { //async выполняется после каждого синхронного,
                                                                // записываем несинхронно, чтобы не забивать стек когда не надо
            if (err) console.error(err)
        });
        return dt;
    }
    this.delete = id => {
        delete data[id];
        writeFile(fileName, JSON.stringify(data), err => { //async выполняется после каждого синхронного,
                                                                // записываем несинхронно, чтобы не забивать стек когда не надо
            if (err) console.error(err)
        });
        return {remove: "done"}
    }

    stat(fileName, (err) => { // асинхронная, т.к. надо обработать ошибку в колбэке
        if (err && err.code === "ENOENT") { //если кидает ошибку и эта ошибка значит,
                                            // что файл не найден, то пишем файл с пустым объектом
            writeFileSync(fileName, "{}"); //sync чтобы создать файл сразу
        }
        data = JSON.parse(readFileSync(fileName, {encoding: "UTF-8"}));// записываем в дату данные из json
    })
}
