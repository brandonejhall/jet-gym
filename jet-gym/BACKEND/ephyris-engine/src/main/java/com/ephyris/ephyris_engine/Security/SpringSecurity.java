package com.ephyris.ephyris_engine.Security;

import org.springframework.context.annotation.Bean;
// Used to mark a method as a Spring bean provider, so it will return a bean managed by the Spring container.
import org.springframework.context.annotation.Configuration;
// Marks a class as a configuration class, which means it will define beans and configuration settings for the Spring application.
import org.springframework.security.config.Customizer;
// Imports a static method that provides default security settings for various configurations, simplifying security setup with sensible defaults.
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// Used to configure web-based security in a Spring application, allowing you to specify security rules, such as which endpoints require authentication.
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// Enables Spring Security's web security support for the application, activating the security configuration.
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;
// Defines a chain of security filters that intercept HTTP requests to enforce security policies, such as authentication and authorization.

@Configuration
@EnableWebSecurity
public class SpringSecurity {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                return http
                                .cors(Customizer.withDefaults()) // Enable CORS with default settings
                                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF protection
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().permitAll() // Allow all requests without authentication
                                )
                                .build();
        }

}
