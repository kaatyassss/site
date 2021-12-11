const data = new function () {
    this.create = (obj, callback) => util.ajax({method: "POST", body: JSON.stringify(obj)}, callback);

    this.get = (id, callback) => util.ajax({method: "GET", path: "/" + id}, callback);
    this.getAll = (callback) => util.ajax({method: "GET"}, callback);

    this.update = (obj, callback) => util.ajax({method: "PUT", body: JSON.stringify(obj)}, callback);

    this.delete = (id, callback) => util.ajax({method: "DELETE", path: "/" + id}, callback);
};

function changeDataFormat(data) {
    if (data.indexOf('.') === -1) {
        return data.split("-").reverse().join(".");
    } else {
        return data.split(".").reverse().join("-");
    }
}

const util = new function () {
    this.ajax = (params, callback) => {
        let url = "";
        if (params.path !== undefined) {
            url = params.path;
            delete params.path;
        }
        fetch("/student" + url, params).then(data => data.json()).then(callback);
    }
    this.q = selector => document.querySelectorAll(selector);
    this.id = id => document.getElementById(id);
    this.listen = function (elem, type, callback) {
        elem.addEventListener(type, callback);
    };
};

const student = new function () {
    this.submit = (event) => {
        event.preventDefault()
        let st = {
            name: util.q('.name')[0].value,
            group: util.q('.group')[0].value,
            data: changeDataFormat(util.q('.data')[0].value),
            phone: util.q('.phone')[0].value,
        };
        if (activeAdd) {
            data.create(st, () => {this.render()});
        } else {
            st.Id = activeStudent;
            data.update(st, () => {this.render()});
        }
        util.q('.windowAdd1')[0].style.display = 'none';
        this.render()
    };

    let activeAdd = null;
    let activeStudent = null;

    const remove = function () {
        activeStudent = this.dataset.id;
        data.get(activeStudent, () => {
            util.q('.windowDel')[0].style.display = 'block';
        });
    };

    const edit = function () {
        if (this.dataset) {
            activeStudent = this.dataset.id;
            activeAdd = false;
        }
        if (activeAdd) {
            util.q('.subAdd')[0].innerHTML = 'Добавить';
            util.q('.addForm')[0].reset();
        } else {
            util.q('.subAdd')[0].innerHTML = 'Изменить';

            data.get(activeStudent, (obj) => {
                util.q('.name')[0].value = obj.name;
                util.q('.group')[0].value = obj.group;
                util.q('.data')[0].value = changeDataFormat(obj.data);
                util.q('.phone')[0].value = obj.phone;
            });
        }
        util.q('.windowAdd1')[0].style.display = 'block';
    }
    this.render = () => {
        let str = '';
        data.getAll((resp)=> {
            resp.forEach(obj => {
                let tmp = tpl;
                for (let k in obj) {
                    tmp = tmp.replaceAll(`{` + k + '}', obj[k]);
                }
                str += tmp;
            });
            util.q('.table')[0].innerHTML = str;
            util.q('.buttonDel').forEach(btn => {
                btn.addEventListener('click', remove);
            });
            util.q('.buttonEdit').forEach(btn => {
                btn.addEventListener('click', edit);
            });
            util.q('.closeWindow').forEach(elem => {
                elem.addEventListener('click', () => {
                    elem.parentElement.style.display = 'none';
                });
            });
        });
    };

    let tpl = `<tr>
                    <td>{name}</td>
                    <td>{group}</td>
                    <td>{data}</td>
                    <td>{phone}</td>
                    <td><button class="buttonEdit" data-id={Id}>Изменить</button></td>
                    <td><button class="buttonDel" data-id={Id}>Удалить</button></td>
                </tr>`;

    const init = () => {
        this.render();
        util.q('.buttonAdd')[0].addEventListener('click', () => {
            activeAdd = true;
            edit();
        })
        util.q('.buttond')[0].addEventListener('click', (event) => {
            event.preventDefault();
            data.delete(activeStudent, () => {this.render()});
            util.q('.windowDel')[0].style.display = 'none';
        })
    }

    util.listen(util.q('.addForm')[0], 'submit', (event) => {
        this.submit(event);
    })

    window.addEventListener('load', init);
}