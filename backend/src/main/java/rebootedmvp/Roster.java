package rebootedmvp;

import java.util.HashMap;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Inheritance(strategy = InheritanceType.JOINED) // or JOINED, TABLE_PER_CLASS
@Table(name = "rosters")
public abstract class Roster implements InfoContainer<Course> {

    // @OneToMany
    @JoinColumn(name = "all_courses")
    protected HashMap<Long, Course> allCourses;

    @Column(nullable = false)
    protected String title;

    @Column(columnDefinition = "TEXT")
    protected String body;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

}