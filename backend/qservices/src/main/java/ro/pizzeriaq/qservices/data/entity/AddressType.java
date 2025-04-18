package ro.pizzeriaq.qservices.data.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class AddressType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;


	@OneToMany(mappedBy = "addressType")
	private List<Address> addresses;


	@Column(nullable = false, unique = true, length = 30)
	private String name;
}
