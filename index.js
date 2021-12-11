const http = require("http"),
    crud = require("./crud"),
    staticSrv = require("node-static");

const staticFileDir = new staticSrv.Server("./public"); //создаем экземпляр статического файлового сервера для обслуживания "./public"

const echo = (res, content) => {
    res.end(JSON.stringify(content));
}

const student = (req, res) => {
    res.writeHead(200, {"Content-type": "application/json"});
    const url = req.url.substring(1).split("/");
    switch (req.method) {
        case "GET":
            if (url.length > 1)
                echo(res, crud.get(url[1]));
            else
                echo(res, crud.getAll());
            break;
        case "POST":
            getAsyncData(req, data => {
                echo(res, crud.create(JSON.parse(data)));
            });
            break;
        case "PUT":
            getAsyncData(req, data => {
                echo(res, crud.update(JSON.parse(data)));
            });
            break;
        case "DELETE":
            if (url.length > 1)
                echo(res, crud.delete(url[1]));
            else
                echo(res, {error: "Не передан id"});
            break;
        default:
            echo(res, {error: "500"}); //если ни в какой кейс метод не вошел то вернем
    }
}
const getAsyncData = (req, callback) => {
    let data = "";
    req.on("data", chunk => {
        data += chunk;
    });
    req.on("end", () => {
        callback(data);
    });
}

const handler = function (req, res) {
    const url = req.url.substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "student": //если студент, то вызываем студента
            student(req, res);
            return;
    }
    staticFileDir.serve(req, res); // статический файловый сервер для обслуживания (иначе выдаем статичные файлы)
}

http.createServer(handler).listen(8090, () => {
    console.log("run");
})