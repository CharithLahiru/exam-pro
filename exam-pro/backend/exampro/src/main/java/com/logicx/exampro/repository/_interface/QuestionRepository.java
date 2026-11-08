package com.logicx.exampro.repository._interface;

import com.logicx.exampro.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, String> {
    Optional<Question> findById(String id);

    // method for single random questions
    @Query(value = "SELECT q.* FROM question q " +
            "WHERE q.SUBJECT_ID = :subject_id " +
            "AND q.STATUS = 'PUBLIC' " +
            "AND q.id NOT IN (" +
            "    SELECT scq.question_id FROM student_completed_questions scq " +
            "    WHERE scq.username = :username" +
            ") " +
            "ORDER BY RAND() LIMIT 1",
            nativeQuery = true)
    Optional<Question> findRandomQuestionBySubjectId(
            @Param("subject_id") String subjectId,
            @Param("username") String username
    );

    // method for multiple random questions
    @Query(value = "SELECT q.* FROM question q " +
            "WHERE q.SUBJECT_ID = :subject_id " +
            "AND q.STATUS = 'PUBLIC' " +
            "AND q.id NOT IN (" +
            "    SELECT scq.question_id FROM student_completed_questions scq " +
            "    WHERE scq.username = :username" +
            ") " +
            "ORDER BY RAND() LIMIT :limit",
            nativeQuery = true)
    List<Question> findRandomQuestionsBySubjectId(
            @Param("subject_id") String subject_id,
            @Param("username") String username,
            @Param("limit") int limit
    );
}
