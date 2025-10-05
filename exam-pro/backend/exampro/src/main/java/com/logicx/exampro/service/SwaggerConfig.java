package com.logicx.exampro.service;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${project.version:1.0.0}")
    private String appVersion;

    @Value("${project.name:ExamPro}")
    private String appName;

    @Value("${project.description:User Management API}")
    private String appDescription;

    @Bean
    public OpenAPI examProOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(appName)
                        .description(appDescription)
                        .version(appVersion));
    }
}
