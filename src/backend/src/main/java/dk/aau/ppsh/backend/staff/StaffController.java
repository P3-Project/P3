package dk.aau.ppsh.backend.staff;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffRepository staffRepository;

    // Controlleren snakker med databasen via StaffRepository.
    // Spring giver den automatisk.
    public StaffController(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @GetMapping // svarer på GET /api/staff
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
}
