package Service;
import Model.Personaje;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@Service

public class PersonajeService {
    private final ObjectMapper mapper = new ObjectMapper();

    public List<Personaje> cargarPersonajes() {
        try {
            String fileName = "/data/personajes.json";
            InputStream inputStream = getClass().getResourceAsStream(fileName);
            return mapper.readValue(inputStream, new TypeReference<List<Personaje>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}