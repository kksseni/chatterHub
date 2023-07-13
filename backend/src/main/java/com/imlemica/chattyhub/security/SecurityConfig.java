package com.imlemica.chattyhub.security;

import com.imlemica.chattyhub.filter.CustomAuthorizationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


/**
 * Security class for rest api. Register beans to set up access to endpoints.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
    /**
     * Used to define a custom service with overridden lookup methods.
     */
    private final UserDetailsService userDetailsService;
    /**
     * Used to specify the class with which to encrypt the password.
     */
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * Configures an authentication manager with custom settings
     * to use a specific {@link UserDetailsService} and {@link BCryptPasswordEncoder}.
     * @param http the {@link HttpSecurity} to set an authentication manager
     * @return an authentication manager with custom settings
     * @throws Exception if an error occurs when adding the {@link UserDetailsService}
     * based authentication
     */
    @Bean
    public AuthenticationManager aut(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
        return authenticationManagerBuilder.build();
    }

    /**
     Registers a bean <code>SecurityFilterChain</code> with custom settings to allow endpoints to everyone and some with
     access permission only to the admin. Sets the handling of the 401
     status with custom messages with the reason for the status. Attaches to <code>http</code>
     custom filter {@link CustomAuthorizationFilter}.
     * @param http the {@link HttpSecurity} to modify
     * @return securityFilterChain with custom settings for <code>http</code>
     * @throws Exception if an error occurs when adding the {@link UserDetailsService}
     * based authentication
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        // setting stateless session, because we choose to implement Rest API
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // giving every permission to every request for next endpoints
        http.authorizeRequests().antMatchers( "/meeting/**","/api/**", "/login/**").permitAll();

        // setting custom error message when status code is 401
        http.exceptionHandling()
                .authenticationEntryPoint((request, response, e) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    if (request.getServletPath().equals("/login")){
                        response.getWriter().write("{ \"error\": \"Password or login is not correct.\" }");
                    }
                    else { response.getWriter().write("{ \"error\": \"You are not authenticated.\" }");}
                });

        //http.authorizeRequests().antMatchers("/meeting/**","/chat/**").hasAnyAuthority("ROLE_USER");

        // for everything else, the user has to be authenticated
        http.authorizeRequests().anyRequest().authenticated();
        http.authenticationManager(authenticationManager);
        http.csrf().disable().cors().and();

        // adding the custom filter before UsernamePasswordAuthenticationFilter in the filter chain
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
