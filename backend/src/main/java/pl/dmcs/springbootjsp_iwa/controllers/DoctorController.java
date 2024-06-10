package pl.dmcs.springbootjsp_iwa.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import pl.dmcs.springbootjsp_iwa.model.Doctor;

@Controller
public class DoctorController {

    @RequestMapping("/doctor")
    public String doctor(Model model) {
        model.addAttribute("message","Simple String from DoctorController.");
        Doctor newDoctor = new Doctor();
        model.addAttribute("doctor",newDoctor);
        return "doctor";
    }

    @RequestMapping(value = "/addDoctor.html", method = RequestMethod.POST)
    public String addDoctor(@ModelAttribute("doctor") Doctor doctor) {

        System.out.println(doctor.getFirstname() + " " + doctor.getLastname() +
                " " + doctor.getProfession());

        return "redirect:doctor";
    }

}

