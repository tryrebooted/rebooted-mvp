package rebootedmvp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import rebootedmvp.domain.impl.RosterImpl;
import rebootedmvp.dto.NewRosterDTO;
import rebootedmvp.service.RosterService;

@Component
public class StartupRunner implements CommandLineRunner {

    private final RosterService rosterService;

    // Constructor injection
    @Autowired
    public StartupRunner(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Application started! Running startup logic...");
        myFunction();
    }

    private void myFunction() {
        rosterService.addToHigh(new NewRosterDTO("Main Roster", "Description"), RosterImpl::new);
    }
}
