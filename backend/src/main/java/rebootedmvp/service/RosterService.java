package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Course;
import rebootedmvp.Roster;
import rebootedmvp.dto.NewCourseDTO;

@Service
public class RosterService extends ServiceType<Roster, Course, NewCourseDTO> {

    @Override
    public Roster create(Long id, String title, String body) {
        return new Roster(id, title, body);
    }

}
