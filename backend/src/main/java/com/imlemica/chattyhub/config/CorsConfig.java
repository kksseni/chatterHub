package com.imlemica.chattyhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Solves error with CORS. Cross-Origin Resource Sharing (CORS) is an HTTP-header based
 * mechanism that allows a server to indicate any origins
 * (domain, scheme, or port) other than its own from which a browser should permit loading resources.
 */
@Configuration
public class CorsConfig {
    /**
     * Configures how to handle cross-origin resource sharing.
     * Allow access to any mapping and from any origin.
     * @return WebMvcConfigurer with customized CORS configuration
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
      return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOriginPatterns("*")
                        .allowedMethods("PUT", "DELETE", "POST", "GET").allowCredentials(true);
            }
        };
    }
}
