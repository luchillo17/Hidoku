Shoes.app {
  title "Hidoku", align: "center"

  @hidokuConfig = {
    filas: 0, columnas: 0, dificultad: 0,
    grid: []
  }

  stack {
    flow {
      stack(width: 0.33) {
        para "Alto: "
        @filas = edit_line
      }
      stack(width: 0.33) {
        para "Ancho: "
        @columnas = edit_line
      }
      stack(width: 0.33) {
        para "Dificultad: "
        @dificultad = edit_line
      }
    }
    @generar = button("Nuevo Hidoku", align: "center") {
      @hidokuContainer.clear
      filas = @filas.text().to_i
      columnas = @columnas.text().to_i
      anchoColumnas = 1.0/columnas
      puts "Filas: #{filas}, Columnas: #{columnas}, anchoColumnas: #{anchoColumnas}"
      @hidokuConfig[:grid] = Array.new(filas) { Array.new columnas }
      filas.times { |i|
        @hidokuContainer.append {
          flow { # Filas
            columnas.times { |j|
              @hidokuConfig[:grid][i][j] = edit_line text: "#{i}, #{j}", width: anchoColumnas
            }
          }
        }
      }
      puts @hidokuConfig[:grid].map { |fila|
        fila.map { |col|
          puts col.text
          col.text()
        }
      }.inspect
    }
  }

  @hidokuContainer = stack {
  }
}