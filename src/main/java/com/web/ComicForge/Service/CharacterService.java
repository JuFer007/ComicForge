package com.web.ComicForge.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.ComicForge.Model.ComicCharacter;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.List;

@Service

public class CharacterService {
    public List<ComicCharacter> getAllCharacters() {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<ComicCharacter>> typeRef = new TypeReference<List<ComicCharacter>>() {};
        InputStream inputStream = getClass().getResourceAsStream("/data/personajes.json");
        try {
            return mapper.readValue(inputStream, typeRef);
        } catch (Exception e) {
            throw new RuntimeException("No se puedo leer el JSON", e);
        }
    }
}
