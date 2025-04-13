package com.ephyris.ephyris_engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.ephyris.ephyris_engine" })
public class EphyrisEngineApplication {

	public static void main(String[] args) {
		SpringApplication.run(EphyrisEngineApplication.class, args);
	}

}
