package com.logicx.exampro.repository._interface;

import com.logicx.exampro.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, String> {
    Optional<Question> findById(String id);
}
