package pl.dmcs.springbootjsp_iwa.controllers; // Add the correct package name here

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Doctor;
import pl.dmcs.springbootjsp_iwa.model.User;
import pl.dmcs.springbootjsp_iwa.model.Visit;
import pl.dmcs.springbootjsp_iwa.repository.DoctorRepository;
import pl.dmcs.springbootjsp_iwa.repository.UserRepository;
import pl.dmcs.springbootjsp_iwa.repository.VisitRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/visits")
public class VisitRESTController {

    private VisitRepository visitRepository;
    private DoctorRepository doctorRepository;
    private UserRepository userRepository;

    @Autowired
    public VisitRESTController(VisitRepository visitRepository, DoctorRepository doctorRepository, UserRepository userRepository) {
        this.visitRepository = visitRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Visit> findAllVisits() {
        return visitRepository.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> addVisit(@RequestBody Map<String, Object> payload) {
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        String date = payload.get("date").toString();
        String prescription = payload.containsKey("prescription") ? payload.get("prescription").toString() : null;

        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (!doctorOpt.isPresent()) {
            return new ResponseEntity<>("Doctor not found", HttpStatus.NOT_FOUND);
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        Visit visit = new Visit();
        visit.setDoctor(doctorOpt.get());
        visit.setUser(userOpt.get());
        visit.setDate(date);
        visit.setPrescription(prescription);
        visitRepository.save(visit);

        return new ResponseEntity<>("Visit created", HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Visit> deleteVisit(@PathVariable("id") long id) {
        Optional<Visit> visitOptional = Optional.ofNullable(visitRepository.findById(id));
        if (!visitOptional.isPresent()) {
            System.out.println("Visit not found!");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        visitRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public ResponseEntity<Visit> findVisit(@PathVariable("id") long id) {
        Optional<Visit> visitOptional = Optional.ofNullable(visitRepository.findById(id));
        return visitOptional.map(visit -> new ResponseEntity<>(visit, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{id}")
    public ResponseEntity<Visit> updateVisit(@PathVariable("id") long id, @RequestBody Visit visit) {
        Optional<Visit> existingVisitOpt = Optional.ofNullable(visitRepository.findById(id));
        if (!existingVisitOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        visit.setId(id);
        Visit updatedVisit = visitRepository.save(visit);

        // Ensure the returned Visit has the full Doctor and User details
        Optional<Doctor> doctorOpt = Optional.ofNullable(doctorRepository.findById(updatedVisit.getDoctor().getId()));
        Optional<User> userOpt = userRepository.findById(updatedVisit.getUser().getId());

        doctorOpt.ifPresent(updatedVisit::setDoctor);
        userOpt.ifPresent(updatedVisit::setUser);

        return new ResponseEntity<>(updatedVisit, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PATCH, value = "/{id}")
    public ResponseEntity<Visit> partialUpdateVisit(@PathVariable("id") long id, @RequestBody Map<String, Object> updates) {
        Optional<Visit> visitOpt = Optional.ofNullable(visitRepository.findById(id));
        if (!visitOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Visit visit = visitOpt.get();
        partialUpdate(visit, updates);
        Visit updatedVisit = visitRepository.save(visit);

        // Ensure the returned Visit has the full Doctor and User details
        updatedVisit.setDoctor(getDoctorById(updatedVisit.getDoctor().getId()));
        updatedVisit.setUser(getUserById(updatedVisit.getUser().getId()));

        return new ResponseEntity<>(updatedVisit, HttpStatus.OK); // Return the updated visit
    }

    private void partialUpdate(Visit visit, Map<String, Object> updates) {
        if (updates.containsKey("doctorId")) {
            Long doctorId = Long.valueOf(updates.get("doctorId").toString());
            Doctor doctor = getDoctorById(doctorId);
            if (doctor != null) {
                visit.setDoctor(doctor);
            }
        }
        if (updates.containsKey("userId")) {
            Long userId = Long.valueOf(updates.get("userId").toString());
            User user = getUserById(userId);
            if (user != null) {
                visit.setUser(user);
            }
        }
        if (updates.containsKey("date")) {
            visit.setDate((String) updates.get("date"));
        }
        if (updates.containsKey("prescription")) {
            visit.setPrescription((String) updates.get("prescription"));
        }
    }

    private Doctor getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId).orElse(null);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Visit> deleteVisits() {
        visitRepository.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
