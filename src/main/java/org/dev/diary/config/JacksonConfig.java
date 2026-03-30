package org.dev.diary.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.json.JsonMapper;

/**
 * Jackson 3 configuration for Spring Boot 4.
 * Uses JsonMapperBuilderCustomizer (Jackson 3) instead of the
 * removed Jackson2ObjectMapperBuilderCustomizer.
 *
 * Jackson 3 removed WRITE_DATES_AS_TIMESTAMPS from SerializationFeature;
 * JavaTimeModule is auto-registered and LocalDate is written as ISO string
 * by default when the datatype-jsr310 module is on the classpath.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer jacksonCustomizer() {
        return (JsonMapper.Builder builder) -> {
            // Jackson 3 auto-registers JavaTimeModule; LocalDate → "yyyy-MM-dd" by default.
            // Nothing extra needed here; hook kept for future feature toggles.
        };
    }
}
