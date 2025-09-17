package com.tcc.apiGateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"jwt.secret=claveDePruebaParaTests1234567890"
})
class ApiGatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
