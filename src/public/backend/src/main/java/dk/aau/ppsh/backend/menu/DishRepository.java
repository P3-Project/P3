package dk.aau.ppsh.backend.menu;

import org.springframework.data.jpa.repository.JpaRepository;

// Spring generates findAll(), findById(), save(), etc. for us
public interface DishRepository extends JpaRepository<Dish, Integer> {}
