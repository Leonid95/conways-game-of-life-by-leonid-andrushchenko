<html>

<head>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <style>
        .inner {
            width: fit-content !important;
            width: -moz-fit-content !important;
        }

        .main-content {
            max-width: none !important;
            width: fit-content !important;
            width: -moz-fit-content !important;
        }

        #main-content>p {
            display: none;
        }

        #sidebar {
            display: none;
        }

        body {
            overflow: scroll;
            font-family: cursive;
        }

        .app-container {
            background-color: bisque;
            min-height: 100vh;
            font-size: 16px;
        }

        #app-title {
            margin-bottom: 30px;
        }

        button {
            background-color: blue;
            color: white;
            font-weight: bold;
            border: none;
            margin-left: 10px;
            margin-top: 10px;
            padding: 3px 15px;
            border-radius: 17px;
        }

        button:hover {
            background-color: orangered;
        }

        div {
            text-align: center;
        }

        #universe {
            margin-left: auto;
            margin-right: auto;
            margin-top: 30px;
            margin-bottom: 30px;
            line-height: 0px;
            text-align: center;
            z-index: 1;
        }

        .cell {
            width: 20px;
            height: 20px;
            border: 1px solid black;
            display: inline-block;
            cursor: pointer;
            z-index: 2;
        }

        .dead-cell {
            background-color: blue;
        }

        .alive-cell {
            background-color: orangered;
        }

        .app-section {
            margin-bottom: 20px;
        }

        #app-state {
            width: fit-content;
            width: -moz-fit-content;
            margin-left: auto;
            margin-right: auto;
            margin-top: 24px;
            padding: 5px 13px;
            border-radius: 27px;
            color: white;
        }

        .stopped-state {
            background-color: orange;
        }

        .running-state {
            background-color: lime;
        }
    </style>

    <title>The Game of Life</title>
</head>


<body>

    <div class="container app-container">

        <div ng-app="theGameOfLife" ng-controller="theGameOfLifeController">

            <h1 id="app-title">Welcome to the Conway's Game of Life </h1>
            <div class="app-section">
                <p>Please provide the number of cells in one row from 5 to 40, default value is 20</p>
                <p>Size : <input type="number" id="size" min="5" max="40" ng-model="size" value="20" placeholder="20">
                    <button type="submit" id="submitSize">Build the Universe</button>
                </p>
            </div>

            <div class="app-section">
                <p>Please provide the duration of pauses between game iterations, the initial value is 100</p>
                <p>Pause : <input type="number" id="size" min="10" ng-model="pause" value="100" placeholder="100">
                </p>
            </div>


            <div class="app-section">
                <button type="submit" id="startTheGame">Start the Game</button>

                <button type="submit" id="stopTheGame">Stop the Game</button>

                <button type="submit" id="clearTheUniverse">Clear the Universe</button>

                <div id="app-state" class="stopped-state">Game is stopped</div>
            </div>


            <div id="universe"></div>

        </div>
    </div>

    <script>
        class Cell {
            constructor(row, column) {
                this.row = row;
                this.column = column;
            }
        }
        var app = angular.module('theGameOfLife', []);
        app.controller('theGameOfLifeController', function ($scope) {
            $(document).ready(function () {
                var table;
                var game_loop;
                var is_game_running = false;

                $scope.size = 20;
                $scope.pause = 100;

                display_initial_universe();

                $("#submitSize").click(function () {
                    display_initial_universe();
                });

                $("#clearTheUniverse").click(function () {
                    display_initial_universe();
                });

                $("#startTheGame").click(function () {
                    if (is_game_running) {
                        return;
                    }

                    is_game_running = true;
                    $("#app-state").text("Game is running");
                    $("#app-state").removeClass("stopped-state");
                    $("#app-state").addClass("running-state");

                    game_loop = window.setInterval(function () {
                        start_the_game();
                    }, $scope.pause);
                });

                $("#stopTheGame").click(function () {
                    stop_the_game();
                });

                $(document).on("click", ".cell", function () {
                    if (is_game_running) {
                        return;
                    }

                    let row = $(this).attr('row');
                    let column = $(this).attr('column');

                    // If the value is 0, then it will become 1, if the value is 1 then it will become 0
                    table[row][column] = (table[row][column] + 1) % 2;

                    display_the_universe();
                });

                function display_initial_universe() {
                    stop_the_game();
                    table = make_clear_table();
                    display_the_universe();
                }

                function modulo(arg) {
                    arg = arg % $scope.size;

                    if (arg < 0) {
                        arg = $scope.size + arg;
                    }

                    return arg;
                }

                function count_neighbours(row, column) {

                    let neighbours = 0;

                    for (move_row = -1; move_row <= 1; move_row++) {
                        for (move_column = -1; move_column <= 1; move_column++) {

                            // Element must not count itselve as a neighbour
                            if (move_row == 0 && move_column == 0) {
                                continue;
                            }

                            let neighbour_row = modulo(row + move_row);


                            let neighbour_column = modulo(column + move_column);

                            if (table[neighbour_row][neighbour_column] == 1) {
                                neighbours++;
                            }
                        }
                    }

                    return neighbours;
                }



                function display_the_universe() {
                    $("#universe").empty();
                    for (let r = 0; r < $scope.size; r++) {
                        for (let c = 0; c < $scope.size; c++) {
                            let cell_state;

                            if (table[r][c] == 1) {
                                cell_state = "alive-cell";
                            }
                            else {
                                cell_state = "dead-cell";
                            }

                            $("#universe").append('<div class="cell ' + cell_state + '" row="' + r + '" column="' + c + '"></div>');
                        }
                        $("#universe").append("<br>");
                    }
                }

                function make_clear_table() {
                    let temp_table = new Array($scope.size);

                    for (let i = 0; i < $scope.size; i++) {
                        temp_table[i] = new Array($scope.size);
                    }

                    for (let r = 0; r < $scope.size; r++) {
                        for (let c = 0; c < $scope.size; c++) {
                            temp_table[r][c] = 0;
                        }
                    }

                    return temp_table;
                }


                function start_the_game() {
                    let cells_to_live = new Array();
                    let cells_to_die = new Array();


                    for (let r = 0; r < $scope.size; r++) {
                        for (let c = 0; c < $scope.size; c++) {
                            let neighbours_number = count_neighbours(r, c);

                            if (table[r][c] == 0 && neighbours_number == 3) {
                                cells_to_live.push(new Cell(r, c));
                            }

                            if (table[r][c] == 1 && (neighbours_number < 2 || neighbours_number > 3)) {
                                cells_to_die.push(new Cell(r, c));
                            }
                        }
                    }

                    for (i = 0; i < cells_to_live.length; i++) {
                        let current_cell = cells_to_live[i];

                        table[current_cell.row][current_cell.column] = 1;
                    }

                    for (i = 0; i < cells_to_die.length; i++) {
                        let current_cell = cells_to_die[i];

                        table[current_cell.row][current_cell.column] = 0;
                    }

                    cells_to_live = [];
                    cells_to_die = [];

                    display_the_universe();


                }

                function stop_the_game() {
                    is_game_running = false;
                    $("#app-state").text("Game is stopped");
                    $("#app-state").removeClass("running-state");
                    $("#app-state").addClass("stopped-state");
                    clearInterval(game_loop);
                }
            });
        });


    </script>

</body>


</html>
