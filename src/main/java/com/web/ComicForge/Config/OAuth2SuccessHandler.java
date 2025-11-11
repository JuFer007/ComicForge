package com.web.ComicForge.Config;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@AllArgsConstructor

public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UsuarioService usuarioService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = token.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        Usuario usuario = usuarioService.handleGoogleLogin(email, name, picture);

        HttpSession session = request.getSession();
        session.setAttribute("isLoggedIn", true);
        session.setAttribute("userId", usuario.getId());
        session.setAttribute("role", usuario.getRole());
        session.setAttribute("profilePic", usuario.getProfilePicture());
        session.setAttribute("userName", usuario.getUserName());

        response.sendRedirect("/");
    }
}
