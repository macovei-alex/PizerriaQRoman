package ro.pizzeriaq.qservices.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pizzeriaq.qservices.data.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
}
