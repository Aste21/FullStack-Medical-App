package pl.dmcs.springbootjsp_iwa.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Doctor;
import pl.dmcs.springbootjsp_iwa.repository.AddressRepository;
import pl.dmcs.springbootjsp_iwa.repository.DoctorRepository;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/doctors")
public class DoctorRESTController {

    private DoctorRepository doctorRepository;

    @Autowired
    public DoctorRESTController(DoctorRepository doctorRepository, AddressRepository addressRepository) {
        this.doctorRepository = doctorRepository;
    }

    @RequestMapping(method = RequestMethod.GET/*, produces = "application/xml"*/)
    //@GetMapping
    public List<Doctor> findAllDoctors() { return doctorRepository.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    //@PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {

        // Commented out due to simplify http requests sent from angular app
//        if (doctor.getAddress().getId() <= 0 )
//        {
//            addressRepository.save(doctor.getAddress());
//        }
        // Commented out due to simplify http requests sent from angular app
        doctorRepository.save(doctor);
        return new ResponseEntity<Doctor>(doctor, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    //@DeleteMapping("/{id}")
    public ResponseEntity<Doctor> deleteDoctor (@PathVariable("id") long id) {
        Doctor doctor = doctorRepository.findById(id);
        if (doctor == null) {
            System.out.println("Doctor not found!");
            return new ResponseEntity<Doctor>(HttpStatus.NOT_FOUND);
        }
        doctorRepository.deleteById(id);
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    //@PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@RequestBody Doctor doctor, @PathVariable("id") long id) {
        doctor.setId(id);
        doctorRepository.save(doctor);
        return new ResponseEntity<Doctor>(doctor, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    //@PatchMapping("/{id}")
    public ResponseEntity<Doctor> updatePartOfDoctor(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Doctor doctor = doctorRepository.findById(id);
        if (doctor == null) {
            System.out.println("Doctor not found!");
            return new ResponseEntity<Doctor>(HttpStatus.NOT_FOUND);
        }
        partialUpdate(doctor,updates);
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }

    private void partialUpdate(Doctor doctor, Map<String, Object> updates) {
        if (updates.containsKey("firstname")) {
            doctor.setFirstname((String) updates.get("firstname"));
        }
        if (updates.containsKey("lastname")) {
            doctor.setLastname((String) updates.get("lastname"));
        }
        if (updates.containsKey("profession")) {
            doctor.setProfession((String) updates.get("profession"));
        }
        doctorRepository.save(doctor);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    //@DeleteMapping("/{id}")
    public ResponseEntity<Doctor> deleteDoctors() {
        doctorRepository.deleteAll();
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }

}
