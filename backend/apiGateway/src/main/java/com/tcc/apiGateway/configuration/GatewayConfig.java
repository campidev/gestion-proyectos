package com.tcc.apiGateway.configuration;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth_route", r -> r.path("/auth/**","/api/**")
                        .filters(f -> f.stripPrefix(1)) // opcional, si quieres ajustar la ruta
                        .uri("http://localhost:9000"))
                .build();
    }


}

