package com.web.ComicForge.Config;
import com.web.ComicForge.Util.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

public class SecurityConfig {
    private final OAuth2SuccessHandler oauth2SuccessHandler;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin/users", "/admin/users/**").hasAuthority("admin")
                        .requestMatchers("/admin/dashboard-stats").hasAuthority("admin")
                        .requestMatchers("/api/comics/editar/**").hasAuthority("admin")
                        .requestMatchers("/api/comics/addComic").hasAuthority("admin")
                        .requestMatchers("/admin", "/admin/**").permitAll()

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
                                "/descuentos",
                                "/top-comics",
                                "/publishers",
                                "/profile",
                                "/user/**",
                                "/cart/**",
                                "/error403",
                                "/sales",
                                "/sales/export"
                        ).permitAll()

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
                                "/api/**",
                                "/top-comics",
                                "/publishers"
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
                        .authenticationEntryPoint((request, response, authException) -> {
                            if (request.getRequestURI().startsWith("/api/")) {
                                response.setStatus(401);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"status\":\"error\",\"message\":\"No autenticado\"}");
                            } else {
                                response.sendRedirect("/login");
                            }
                        })
                );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
