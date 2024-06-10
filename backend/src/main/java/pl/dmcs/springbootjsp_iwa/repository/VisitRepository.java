package pl.dmcs.springbootjsp_iwa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.springbootjsp_iwa.model.Visit;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit,Long> {
    Visit findById(long id);

    List<Visit> findByUserId(Long userId);
}

