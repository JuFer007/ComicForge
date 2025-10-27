package com.web.ComicForge.Service;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.User;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private final ComicRepository comicRepository;

    //Retornar usuario por id
    public Optional<User> getUserByID(Long id) {
        return userRepository.findById(id);
    }

    //Guardar usuario
    public User guardarUsuario(User user) {
        return userRepository.save(user);
    }

    //Retornar usuario por gmail
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    //Registrar usuario
    public User registerUser(String email, String password, String userName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El correo ya esta registrado");
        }
        User user = User.builder().
        email(email).password(password).userName(userName).userBio("Usuario nuevo en Comic Forge. Entusiasmado por leer cómics").
        profilePicture("/recursos/avatares/avatarDefault.jpg").coverImageURL("/recursos/portadas/portada1.jpg").role("cliente").build();
        return userRepository.save(user);
    }

    //Verificar login
    public User loginUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent() && optionalUser.get().getPassword().equals(password)) {
            User user = optionalUser.get();
            return user;
        } else {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }
    }

    //Obtener favoritos
    public List<Comic> getUserFavorites(Long userId){
        return userRepository.findById(userId).map(User :: getFavoriteComics).orElse(List.of());
    }

    //Agregar comic a favorito
    public boolean addComicToFavorites(Long userId, Long comicId){
        Optional<User> optionalUser = userRepository.findById(userId);
        Optional<Comic> optionalComic = comicRepository.findById(comicId);

        if (optionalUser.isEmpty() || optionalComic.isEmpty()) return false;

        User user = optionalUser.get();
        Comic comic = optionalComic.get();

        if (user.getFavoriteComics().contains(comic)) return false;

        user.getFavoriteComics().add(comic);
        userRepository.save(user);
        return true;
    }

    //Listar todos los usuarios
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    //Eliminar usuario por id
    public boolean deleteUserById(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
}
