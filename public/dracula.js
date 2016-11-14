"use strict";

function Tree(containerEl, outputElemInfo, outputTreeInfo) {
    var self = this;
    var visual = new Visual(containerEl);
    var vertexes = [];
    var edges = {};
    var root = null;
    var isTree = true;

    this.init = function () {
        root = this.addVertex(1);
        this.addVertex(2);
        this.addVertex(3);
        this.addVertex(4);
        this.addEdge(1, 2, 5);
        this.addEdge(1, 3, 4);
        this.addEdge(2, 4);
        outputElemInfo(compileVertexInfo(root));
        this.draw();
        return this;
    };

    //Публичная функция для добавления вершины
    this.addVertex = function (name) {
        name = name.toString();
        if (findVertexByName(name)) {
            return alert('Такая вершина уже была добавлена');
        }
        var vertex = new Vertex(name);
        vertexes.push(vertex);
        return vertex;
    };
    //--------------------------------------------

    //Публичная функция для добавления ребра
    this.addEdge = function (from, to, weight) {
        from = from.toString();
        to = to.toString();
        var name = getEdgeName(from, to);
        if (!edges[name]) {
            edges[name] = [];
            findVertexByName(from).adjacent.push(findVertexByName(to));
        }
        edges[name].push(+weight || 1);
    };
    //--------------------------------------------


    //Публичная функция для удаления ребра
    this.deleteEdge = function (from, to, weight) {
        var name = getEdgeName(from, to);
        if (!edges[name]) {
            return alert('Ребро не найдено');
        }
        if (edges[name].length == 1 || !weight) {
            delete edges[name];
            var parent = findVertexByName(from);
            var childIndex = parent.adjacent.findIndex((a) => {return a.name == to});
            parent.adjacent.splice(childIndex, 1);
        } else {
            weight = +weight;
            var edgeIndex = edges[name].indexOf(weight);
            if (edgeIndex == -1) {
                return alert('Ребро не найдено');
            }
            edges[name].splice(edgeIndex, 1);
        }
    };
    //--------------------------------------------

    //Публичная функция для удаления вершины
    this.deleteVertex = function (name) {
        var index;
        vertexes.forEach((v, i) => {
                if (v.name == name) {
                    index = i;
                } else { //remove from adjacent
                    var adjacentIndex = v.adjacent.findIndex((v) => {
                        return v.name == name
                    });
                    if (adjacentIndex != -1) {
                        v.adjacent.splice(adjacentIndex, 1);
                    }
                }
            }
        );
        Object.keys(edges).forEach((e) => {
            var vertexes = getVertexesByEdge(e);
            if (vertexes[0] == name || vertexes[1] == name) {
                delete edges[e];
            }
        });
        vertexes.splice(index, 1);
    };
    //--------------------------------------------

    /*
     Публичная функция для поиска вершины по имени
     Возвращает информацию о вершине в HTML
     Отмечает вершину на визуальном графе на странице
     */
    this.findVertex = function (name) {
        visual.select(name);
        return compileVertexInfo(findVertexByName(name));
    };
    //--------------------------------------------

    /*
    Публичная функция, делает дерево сбалансированным.
    Под сбалансированным понимается дерево, высота правого и левого поддерева которого различаются не более, чем на 1
     */
    this.balance = function () {
        if (!isTree) {
            return alert('Пожалуйста, убедитесь, что граф является деревом');
        }
        var emptyVertexes = [];
        setInitialState(root);
        var queue = [root];
        while (queue.length) {
            var vertex = queue.shift();
            if (!vertex.adjacent.length) {
                emptyVertexes.push(vertex);
            }
            if (emptyVertexes[0] && vertex.distance > (emptyVertexes[0].distance + 1)) {
                var weight = getEdgeWeight(vertex.parent, vertex);
                emptyVertexes.push(vertex.parent);
                this.deleteEdge(vertex.parent.name, vertex.name);
                this.addEdge(emptyVertexes[0].name, vertex.name, weight);
                vertex.distance = emptyVertexes[0].distance + 1;
                emptyVertexes.splice(0, 1);
            }
            vertex.adjacent.forEach((adjacent) => {
                if (adjacent.color == 'white') {
                    adjacent.color = 'gray';
                    adjacent.distance = vertex.distance + 1;
                    adjacent.parent = vertex;
                    queue.push(adjacent);
                }
            });
            vertex.color = 'black';
        }
    };
    //--------------------------------------------

    //Приватная функция для поиска высоты дерева
    function findHeight (skipDistanceCalc) {
        !skipDistanceCalc && this.bfs();
        return Math.max.apply(Math, vertexes.map((v) => { return v.distance; }));
    }
    //--------------------------------------------

    //Приватная функция для составления HTML-версии информации о вершине
    function compileVertexInfo (vertex) {
        var s = `<p>Имя - ${vertex.name}</p>`;
        if (vertex.distance) {
            s += `<p>Дистанция - ${root == vertex ? 0 : vertex.distance || 'N/A'}</p>`;
        }
        if (vertex.key) {
            s += `<p>Ключ - ${root == vertex ? 0 : vertex.key || 'N/A'}</p>`;
        }
        if (vertex.startTime) {
            s += `<p>Время - ${vertex.startTime} / ${vertex.finishTime}</p>`;
        }
        s +=`<p>Дочерние вершины - ${vertex.adjacent.length ? vertex.adjacent.map((a) => {return a.name}) : 'N/A'}</p>`;
        if (root == vertex) {
            s += "<p>Является корнем</p>";
        }
        return s;
    }
    //--------------------------------------------

    /*
     Приватная функция для поиска вершины по имени.
     Возвращает ссылку на экземпляр искомой вершины
     */
    function findVertexByName(name) {
        return vertexes.find((v) => {
            return v.name == name;
        });
    }
    //--------------------------------------------

    /*
    Обход дерева в ширину
     */
    this.bfs = function () {
        setInitialState(root);
        var queue = [root];
        while (queue.length) {
            var vertex = queue.shift();
            vertex.adjacent.forEach((adjacent) => {
                if (adjacent.color == 'white') {
                    adjacent.color = 'gray';
                    adjacent.distance = vertex.distance + 1;
                    adjacent.parent = vertex;
                    queue.push(adjacent);
                }
            });
            vertex.color = 'black';
        }
    };
    //--------------------------------------------

    /*
     Обход дерева в глубину
     */
    this.dfs = function () {
        setInitialState();
        var time = 0;

        vertexes.forEach((vertex) => {
            if (vertex.color === 'white') {
                visit(vertex);
            }
        });

        function visit(vertex) {
            vertex.color = 'gray';
            vertex.startTime = ++time;
            vertex.adjacent.forEach((adjacent) => {
                if (adjacent.color === 'white') {
                    adjacent.parent = vertex;
                    visit(adjacent);
                }
            });
            vertex.color = 'black';
            vertex.finishTime = ++time;
        }
    };
    //--------------------------------------------

    /*
    Поиск кратчайшего пути методом Дейкстры
     */
    this.dijkstra = function (start) {
        //Найти нужную вершину по имени, введенному пользователем
        start = findVertexByName(start);
        if (!start) alert ('Введите корректное имя начальной вершины');

        setInitialState(start);

        var s = [];
        //Очередь с приоритетом: отсортировать по возрастанию key
        var q = [];
        Array.prototype.push.apply(q, vertexes);
        q.sort((a, b) => { return a.key > b.key; });

        while (q.length) {
            var minVertex = q.shift();
            s.push(minVertex);
            minVertex.adjacent.forEach((adjacent) => {
                relax(minVertex, adjacent);
            });
        }
    };
    //--------------------------------------------

    /*
     Поиск кратчайшего пути методом Беллмана-Форда
     */
    this.bellmanFord = function (start) {
        //Найти нужную вершину по имени, введенному пользователем
        start = findVertexByName(start);
        if (!start) alert ('Введите корректное имя начальной вершины');

        setInitialState(start);

        for (var i = 1, l = vertexes.length; i < l; i++) {
            for (var edge in edges) {
                //Попробовать ослабить ребро
                tryRelax(edge);
            }
        }
        /*
        Пройтись по ребрам и попробовать ослабить их
        Если tryRelax вернет true, значит ребро нуждалось в ослаблении
        Если после предыдущего прохода остались ребра, которые еще можно ослабить - в графе есть циклы с отрицательной длиной
         */
        for (var edge in edges) {
            if (tryRelax(edge)) {
                alert ('Убедитесь, что нет циклов с отрицательной длиной');
                return false;
            }
        }

        /*
        Функция, которая "пробует" ослабить ребро. Если ребро нуждалось в ослаблении, вернет true, если нет - false
         */
        function tryRelax(edge) {
            var edgeVertexes = getVertexesByEdge(edge);
            return relax(edgeVertexes[0], edgeVertexes[1]);
        }

        return true;
    };
    //--------------------------------------------

    /*
     Поиск кратчайшего пути методом Флойда-Уоршелла
     */
    this.floydWarshall = function () {
        var n = vertexes.length;

        //Составить  матрицу длин путей
        var weightMatrix = (function () {
            var w = [];
            for (var i = 0; i < n; i++) {
                var temp = [];
                for (var j = 0; j < n; j++) {
                    temp[j] = getEdgeWeight(vertexes[i], vertexes[j]);
                }
                w[i] = temp;
            }
            return w;
        })();

        for (var k = 0; k < n; k++) {
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < n; j++) {
                    weightMatrix[i][j] = Math.min(weightMatrix[i][j], weightMatrix[i][k] + weightMatrix[k][j]);
                }
            }
        }

        /*
        Вывод полученной матрицы в HTML форме (в виде таблицы)
         */
        (function output() {
            var output = '<table><tr><td></td>';
            for (var i = 0; i < n; i++) {
                output += `<td><b>${vertexes[i].name}</b></td>`;
            }
            output += '</tr>';
            for (var i = 0; i < n; i++) {
                var temp = '<tr>';
                for (var j = 0; j < n; j++) {
                    if (!j) temp += `<td><b>${vertexes[i].name}</b></td>`;
                    temp += `<td>${isFinite(weightMatrix[j][i]) ? weightMatrix[j][i] || '*' : '-'}</td>`;
                }
                output += temp + '</tr>';
            }
            output += '</table>';
            outputTreeInfo(output);
        })();
        //--------------------------------------------

        return weightMatrix;
    };
    //--------------------------------------------

    /*
    Поиск кратчайшего оставного дерева методом Прима
     */
    this.prim = function (root) {
        /*
        метод Прима оперирует с неориентированными графами
        самый простой способ имитировать неориентированный граф - добавить противоположные ребра с теми же весами
         */
        addOppositeEdges();

        root = findVertexByName(root);
        if (!root) alert ('Введите корректное имя начальной вершины');

        setInitialState(root);

        //Очередь с приоритетом: отсортировать по возрастанию key
        var q = [];
        Array.prototype.push.apply(q, vertexes);
        q.sort((a, b) => { return a.key > b.key; });

        while (q.length) {
            var minVertex = q.shift();
            minVertex.adjacent.forEach((adjacent) => {
                if (q.indexOf(adjacent) != -1 && getEdgeWeight(minVertex, adjacent) < adjacent.key) {
                    adjacent.prev = minVertex;
                    adjacent.key = getEdgeWeight(minVertex, adjacent);
                }
            });
        }

        /*
         Формирование полученного дерева и его визуальное отображение
         */
        (function compileNewTree () {
            //Удалить все ребра
            for (var edge in edges) {
                var edgeV = getVertexesByEdge(edge);
                self.deleteEdge(edgeV[0], edgeV[1]);
            }

            //Добавить нужные ребра
            vertexes.forEach((v) => {
                if (!v.prev) return;
                self.addEdge(v.prev.name, v.name, v.key);
            });

            self.draw();
        })();
        //--------------------------------------------
    };

    /*
     Поиск кратчайшего оставного дерева методом Крускала
     */
    this.kruskal = function () {
        var a = [];
        var sets = [];

        //отсортированные по возрастанию весов ребра
        var sortedEdgesKeys = Object.keys(edges).sort((a, b) => {
            return getEdgeWeight(a) > getEdgeWeight(b);
        });

        vertexes.forEach((vertex) => {
            sets.push([vertex.name]);
        });

        sortedEdgesKeys.forEach((edge) => {
            var edgeVertexes = getVertexesByEdge(edge);
            var setId1 = findSet(edgeVertexes[0]);
            var setId2 = findSet(edgeVertexes[1]);
            if (setId1 !== setId2) {
                a.push(edge);
                union(setId1, setId2);
            }
        });

        function findSet(vertex) {
            return sets.findIndex((s) => {
                return s.indexOf(vertex) !== -1;
            });
        }

        function union(setId1, setId2) {
            Array.prototype.push.apply(sets[setId1], sets[setId2]);
            sets.splice(setId2, 1);
        }

        /*
         Формирование полученного дерева и его визуальное отображение
         */
        (function compileNewTree () {
            //Удалить все ненужные ребра
            for (var edge in edges) {
                var edgeV = getVertexesByEdge(edge);
                if (a.indexOf(edge) == -1) {
                    self.deleteEdge(edgeV[0], edgeV[1]);
                } else {
                    edges[edge] = [getEdgeWeight(edgeV[0], edgeV[1])];
                }
            }
            //Ориентировать дерево от 1ой вершины (метод строит неориентированное дерево)
            (function targetFromVertex (vertex) {
                for (var edge in edges) {
                    if ((new RegExp(':' + vertex.name + '$')).test(edge)) {
                        var from = getVertexesByEdge(edge)[0];
                        if (from == vertex.parent) continue;
                        var weight = getEdgeWeight(edge);
                        self.deleteEdge(from, vertex.name);
                        self.addEdge(vertex.name, from, weight);
                    }
                }
                vertex.adjacent.forEach((a) => { a.parent = vertex.name; targetFromVertex(a) });
            })(vertexes[0]);

            self.draw();
        })();
        //--------------------------------------------

        return a;
    };
    //--------------------------------------------

    /*
    Приватная функция для добавления противоположных ребер с теми же весами
    Используется для имитации неориентированного графа
     */
    function addOppositeEdges () {
        for (var edge in edges) {
            var edgeV = getVertexesByEdge(edge);
            var oppositeEdge = getEdgeName(edgeV[1], edgeV[0]);
            edges[oppositeEdge] = edges[oppositeEdge] || [];
            edges[oppositeEdge].forEach((w) => {
                if (edges[edge].indexOf(w) == -1) {
                    self.addEdge(edgeV[0], edgeV[1], w);
                }
            });
            edges[edge].forEach((w) => {
                if (edges[oppositeEdge].indexOf(w) == -1) {
                    self.addEdge(edgeV[1], edgeV[0], w);
                }
            });
        }
    }
    //--------------------------------------------

    /*
     Приватная функция для получения веса ребра
     При наличии нескольких кратных ребер - возвращается минимальный вес
     */
    function getEdgeWeight() {
        var weights;

        //Определить поведение функции в зависимости от переданных аргументов
        if (arguments[1]) {
            //Если передано 2 аргумента - это начальная и конечная вершины
            var from = arguments[0].name || arguments[0];
            var to = arguments[1].name || arguments[1];
            if (from === to) {
                return 0;
            }
            weights = edges[from + ':' + to];
        } else {
            //Если передан 1 аргумент - это имя ребра
            weights = edges[arguments[0]];
        }
        if (!weights) {
            return Infinity;
        }
        if (weights instanceof Array) {
            return Math.min.apply(Math, weights);
        }
        return weights;
    }
    //--------------------------------------------

    /*
     Приватная функция для ослабления ребра
     */
    function relax(parent, child) {
        parent = parent.name ? parent : findVertexByName(parent);
        child = child.name ? child : findVertexByName(child);
        var pathLength = getEdgeWeight(parent, child);
        if (child.distance > (parent.distance + pathLength)) {
            child.distance = parent.distance + pathLength;
            child.parent = parent;
            return true;
        }
        return false;
    }
    //--------------------------------------------

    /*
     Приватная функция для поиска потенциальной корневой вершины
     Ищет вершину, из котоой исходят ребра, но в которую не входит ни одно ребро
     */
    function findRoot (edgesNames) {
        return vertexes.find((vertex) => {
            var hasFromEdges = false;
            var hasToEdges = false;
            edgesNames.forEach((edge) => {
                if ((new RegExp(':' + vertex.name + '$')).test(edge)) {
                    return hasToEdges = true;
                }
                if ((new RegExp('^' + vertex.name + ':')).test(edge)) {
                    hasFromEdges = true;
                }
            });
            return hasFromEdges && !hasToEdges;
        });
    }
    //--------------------------------------------

    /*
     Публичная функция для отрисовки дерева
     */
    this.draw = function () {
        var edgesNames = Object.keys(edges);
        var edgesAmount = edgesNames.length;
        root = findRoot(edgesNames);
        if (root) {
            self.bfs();
            var unconnectedVertexes = vertexes
                .filter((v) => {
                    return v.color == 'white';
                });
        }
        var text = "";
        edgesNames.forEach((e, id) => {
            var vertexes = getVertexesByEdge(e);
            if (vertexes[1] == vertexes[0]) {
                text += `<p>У вершины<b> ${vertexes[1]} </b>петля</p>`;
            } else if (edges[e].length > 1 || edges[getEdgeName(vertexes[1], vertexes[0])]) {
                text += `<p>Между вершинами<b> ${vertexes[0]} </b>и<b> ${vertexes[1]} </b>более 1 ребра</p>`;
            }
            for (var i = id + 1; i < edgesAmount; i++) {
                if ((new RegExp(':' + vertexes[1] + '$')).test(edgesNames[i])) {
                    text += `<p>У вершины<b> ${vertexes[1]} </b>степень захода больше 1</p>`;
                    break;
                }
            }
        });
        if (root) {
            text += unconnectedVertexes.length ? `<p>Вершины, не связанные с корнем: ${unconnectedVertexes.map((v) => {return v.name})}</p>` : '';
            outputElemInfo(compileVertexInfo(root));
        } else {
            outputElemInfo('<p>Невозможно установить корень</p>');
        }
        isTree = !text;
        text = isTree ? `<p>Граф является деревом c высотой ${findHeight(true)}</p>` : text;
        clearState();
        visual.drawScheme();
        outputTreeInfo(text);
    };
    //--------------------------------------------

    /*
     Приватная функция для удаления временных свойств вершин
     */
    function clearState() {
        vertexes.forEach((vertex) => {
            delete vertex.color;
            delete vertex.distance;
            delete vertex.key;
            delete vertex.parent;
            delete vertex.prev;
        });
    }
    //--------------------------------------------

    /*
     Приватная функция для инициализации начальных значений свойств ребра, используемых алгоритмами
     */
    function setInitialState(start) {
        vertexes.forEach((vertex) => {
            vertex.color = 'white';
            vertex.distance = Infinity;
            vertex.key = Infinity;
            vertex.parent = null;
            vertex.prev = null;
        });
        if (start) {
            start.distance = start.key = 0;
            start.color = 'gray';
        }
    }
    //--------------------------------------------

    /*
     Приватная функция для получения имени ребра по именам начальной и конечной вершины
     */
    function getEdgeName(from, to) {
        return from + ':' + to;
    }
    //--------------------------------------------

    /*
     Приватная функция для получения имен начальной и конечной вершины по имени ребра
     */
    function getVertexesByEdge(edge) {
        return edge.split(':');
    }
    //--------------------------------------------

    /*
     Класс для создания экземпляров вершин
     */
    function Vertex(name) {
        this.name = name;
        this.adjacent = [];
        return this;
    }
    //--------------------------------------------

    /*
     Класс для визуальной отрисовки графа с помощью библиотеки Cytoscape.js
     */
    function Visual(container) {
        var selected;

        var style = cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'center',
                'color': 'white',
                'background-color': 'data(color)'
            })
            .selector('edge')
            .css({
                'content': 'data(label)',
                'color': 'blue',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#ccc',
                'line-color': '#ccc',
                'width': 1
            })
            .selector(':selected')
            .css({
                'background-color': 'blue',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black'
            });

        var scheme = cytoscape({
            container: container,
            style: style,
            userZoomingEnabled: false,
            maxZoom: 2,
            layout: {name: 'cose'}
        });

        scheme.on('select', function (event) {
            selected = event.cyTarget;
            switch (selected.group()) {
                case 'nodes':
                    outputElemInfo(compileVertexInfo(findVertexByName(selected.id())));
            }
        });

        this.select = function (name) {
            selected && selected.unselect();
            selected = scheme.$('#' + name).select();
        };

        this.drawScheme = function () {
            var vertexList = vertexes.map((v) => {
                return {
                    group: 'nodes',
                    data: {
                        id: v.name,
                        name: v.name,
                        color: v == root ? '#000' : '#999'
                    }
                }
            });

            var edgesList = [];
            Object.keys(edges).forEach((e) => {
                var vertexes = getVertexesByEdge(e);
                edges[e].forEach((w) => {
                    edgesList.push({group: 'edges', data: {source: vertexes[0], target: vertexes[1], label: w}});
                });
            });

            scheme.remove('*');
            scheme.add(Array.prototype.concat(vertexList, edgesList));
            scheme.layout({name: 'cose'});
        }
    }
    //--------------------------------------------
}
