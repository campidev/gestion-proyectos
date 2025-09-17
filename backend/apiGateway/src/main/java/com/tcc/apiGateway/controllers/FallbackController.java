package com.tcc.apiGateway.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class FallbackController {

    @GetMapping("/fallback/projects")
    public Mono<String> fallbackProducts() {
        return Mono.just("Servicio no disponible - usando fallback");
    }


}
