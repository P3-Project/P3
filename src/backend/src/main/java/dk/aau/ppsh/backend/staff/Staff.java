package dk.aau.ppsh.backend.staff;

import jakarta.persistence.*;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "staff_number")
    private String staffNumber;

    private String name;

    private String role;

    private Boolean active;

    public Integer getStaffId() { return staffId; }
    public String getStaffNumber() { return staffNumber; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public Boolean getActive() { return active; }

    public void setRole(String role) { this.role = role; }
} 