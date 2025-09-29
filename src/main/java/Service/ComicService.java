package Service;
import Model.Comic;
import Model.ComicDescuent;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service

public class ComicService {
    private final ObjectMapper mapper = new ObjectMapper();

    public Map<String, java.util.List<Comic>> cargarComics(String tipo) {
        try {
            String fileName = "/data/" + tipo + ".json";
            InputStream inputStream = getClass().getResourceAsStream(fileName);

            if (inputStream == null) {
                throw new RuntimeException("Archivo no encontrado: " + fileName);
            }
            return mapper.readValue(inputStream, new TypeReference<Map<String, java.util.List<Comic>>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }

    public List<Comic> cargarMasVendidos() {
        try {
            String fileName = "/data/masVendidos.json";
            InputStream inputStream = getClass().getResourceAsStream(fileName);
            if (inputStream == null) {
                throw new RuntimeException("Archivo no encontrado: " + fileName);
            }
            return mapper.readValue(inputStream, new TypeReference<List<Comic>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<ComicDescuent> cargarDescuentos() {
        try {
            String fileName = "/data/descuentos.json";
            InputStream inputStream = getClass().getResourceAsStream(fileName);
            if (inputStream == null) {
                throw new RuntimeException("Archivo no encontrado: " + fileName);
            }
            return mapper.readValue(inputStream, new TypeReference<List<ComicDescuent>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
