package com.ephyris.ephyris_engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@ComponentScan(basePackages = { "com.ephyris.ephyris_engine" })
public class EphyrisEngineApplication {

	public static void main(String[] args) {

		Dotenv.configure().directory("BACKEND/ephyris-engine/.env").ignoreIfMissing().load();

		SpringApplication.run(EphyrisEngineApplication.class, args);
	}

}
