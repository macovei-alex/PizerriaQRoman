package ro.pizzeriaq.qservices.unit.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import ro.pizzeriaq.qservices.controller.ProductController;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProductController.class)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProductControllerTest {

	@Value("${server.servlet.context-path}")
	private String contextPath;


	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ProductService productService;


	@Test
	void getAllProductsTest() throws Exception {
		when(productService.getProducts())
				.thenReturn(List.of());

		mockMvc.perform(get(contextPath + "/product/all")
						.contextPath(contextPath))
				.andExpect(status().isOk());
	}

	@Test
	void getSingleNonexistentProductTest() throws Exception {
		when(productService.getProduct(0))
				.thenReturn(Optional.empty());

		mockMvc.perform(get(contextPath + "/product/0")
						.contextPath(contextPath))
				.andExpect(status().isNoContent());
	}

	@Test
	void getSingleProductWithInvalidIdTest() throws Exception {
		mockMvc.perform(get(contextPath + "/product/invalid")
						.contextPath(contextPath))
				.andExpect(status().isBadRequest());
	}
}
