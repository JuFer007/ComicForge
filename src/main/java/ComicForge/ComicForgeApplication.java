package ComicForge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"Controller", "Service", "ComicForge"})
public class ComicForgeApplication {
	public static void main(String[] args) {
		SpringApplication.run(ComicForgeApplication.class, args);
	}
}
