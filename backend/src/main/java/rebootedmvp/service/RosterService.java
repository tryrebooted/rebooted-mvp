package rebootedmvp.service;

import org.springframework.stereotype.Service;

import rebootedmvp.Course;
import rebootedmvp.Roster;
import rebootedmvp.dto.NewCourseDTO;
import rebootedmvp.dto.NewRosterDTO;

@Service
public class RosterService extends ServiceType<Roster, Course, NewCourseDTO, NewRosterDTO> {

}
