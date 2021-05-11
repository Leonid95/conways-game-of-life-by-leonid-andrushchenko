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
                    if(is_game_running){
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
                    if(is_game_running){
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
