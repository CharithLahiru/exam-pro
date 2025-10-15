package com.logicx.exampro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.logicx.exampro")
public class ExamproApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExamproApplication.class, args);
		System.out.println("Application deployed successfully");
	}

}
