package com.web.ComicForge.Config;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor

public class SecurityConfig {
    private final OAuth2SuccessHandler oauth2SuccessHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin", "/admin/**").hasAuthority("admin")
                        .requestMatchers("/api/comics/editar/**").hasAuthority("admin")

                        .requestMatchers("/admin/dashboard-stats", "/top-comics", "/publishers").permitAll()

                        .requestMatchers(
                                "/",
                                "/css/**",
                                "/js/**",
                                "/recursos/**",
                                "/archivosComics/**",
                                "/auth/**",
                                "/api/session/**",
                                "/login",
                                "/registro",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/api/comics/**",
                                "/personajes",
                                "/descuentos"
                        ).permitAll()
                        .requestMatchers("/comic/read/**", "/profile", "/user/**", "/cart/**").authenticated()
                        .anyRequest().authenticated()
                )

                .formLogin(form -> form
                        .loginPage("/login")
                        .successHandler((request, response, authentication) -> {
                            if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("admin"))) {
                                response.sendRedirect("/admin");
                            } else {
                                response.sendRedirect("/");
                            }
                        })
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                )

                .oauth2Login(oauth -> oauth
                        .loginPage("/login")
                        .successHandler(oauth2SuccessHandler)
                        .failureUrl("/login?error=true")
                )

                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/auth/**",
                                "/cart/**",
                                "/user/**",
                                "/comic/**",
                                "/admin/**",
                                "/api/comics/**",
                                "/top-comics",
                                "/publishers",
                                "/admin/dashboard-stats"
                        )
                )

                .exceptionHandling(ex -> ex
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            if (request.getRequestURI().startsWith("/api/")) {
                                response.setStatus(403);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"status\":\"error\",\"message\":\"Acceso denegado\"}");
                            } else {
                                response.sendRedirect("/error403");
                            }
                        })
                );

        return http.build();
    }
}
