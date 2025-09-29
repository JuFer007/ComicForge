package Model;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Personaje {
    private String imagen;
    private String alias;
    private String descripcion;
    private String poderes;
    private String equipos;
}
