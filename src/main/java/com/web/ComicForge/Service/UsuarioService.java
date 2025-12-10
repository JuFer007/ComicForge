package com.web.ComicForge.Service;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UsuarioService {
    @Autowired
    private final UsuarioRepository userRepository;
    private final ComicRepository comicRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<Usuario> getUserByID(Long id) {
        return userRepository.findById(id);
    }

    public Usuario guardarUsuario(Usuario user) {
        return userRepository.save(user);
    }

    public Optional<Usuario> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Usuario registerUser(String email, String password, String userName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        String encryptedPassword = passwordEncoder.encode(password);

        Usuario user = Usuario.builder()
                .email(email)
                .password(encryptedPassword)
                .userName(userName)
                .userBio("Usuario nuevo en Comic Forge. Entusiasmado por leer cómics")
                .profilePicture("/recursos/avatares/avatarDefault.jpg")
                .coverImageURL("/recursos/portadas/portada1.jpg")
                .role("cliente")
                .build();

        return userRepository.save(user);
    }

    public Usuario loginUser(String email, String password) {
        Optional<Usuario> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        Usuario user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        return user;
    }

    public List<Comic> getUserFavorites(Long userId) {
        return userRepository.findById(userId)
                .map(Usuario::getFavoriteComics)
                .orElse(List.of());
    }

    public boolean addComicToFavorites(Long userId, Long comicId) {
        Optional<Usuario> optionalUser = userRepository.findById(userId);
        Optional<Comic> optionalComic = comicRepository.findById(comicId);

        if (optionalUser.isEmpty() || optionalComic.isEmpty()) return false;

        Usuario user = optionalUser.get();
        Comic comic = optionalComic.get();

        if (user.getFavoriteComics().contains(comic)) return false;

        user.getFavoriteComics().add(comic);
        userRepository.save(user);
        return true;
    }

    public List<Usuario> getAllUser() {
        return userRepository.findAll();
    }

    public boolean deleteUserById(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public Usuario handleGoogleLogin(String email, String name, String picture) {
        Optional<Usuario> existingUser = getUserByEmail(email);
        Usuario usuario;

        if (existingUser.isPresent()) {
            usuario = existingUser.get();
            if (picture != null && !picture.equals(usuario.getProfilePicture())) {
                usuario.setProfilePicture(picture);
                usuario = userRepository.save(usuario);
            }
        } else {
            usuario = Usuario.builder()
                    .email(email)
                    .password("oauth_google")
                    .userName(name)
                    .userBio("Usuario nuevo en Comic Forge. Entusiasmado por leer cómics")
                    .profilePicture(picture)
                    .coverImageURL("/recursos/portadas/portada1.jpg")
                    .role("cliente")
                    .build();
            usuario = userRepository.save(usuario);
        }
        return usuario;
    }
}
