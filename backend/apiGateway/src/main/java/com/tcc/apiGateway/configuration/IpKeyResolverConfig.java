package com.tcc.apiGateway.configuration;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;

@Configuration
public class IpKeyResolverConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String forwarded = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
            if (forwarded != null) {
                return Mono.just(forwarded.split(",")[0].trim());
            }
            InetSocketAddress addr = exchange.getRequest().getRemoteAddress();
            String ip = (addr != null) ? addr.getAddress().getHostAddress() : "unknown";
            return Mono.just(ip);
        };
    }
}
