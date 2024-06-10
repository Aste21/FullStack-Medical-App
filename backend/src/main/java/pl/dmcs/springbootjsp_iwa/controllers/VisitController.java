package pl.dmcs.springbootjsp_iwa.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import pl.dmcs.springbootjsp_iwa.model.Visit;

@Controller
public class VisitController {

    @RequestMapping("/visit")
    public String visit(Model model) {
        model.addAttribute("message","Simple String from VisitController.");
        Visit newVisit = new Visit();
        model.addAttribute("visit",newVisit);
        return "visit";
    }

    @RequestMapping(value = "/addVisit.html", method = RequestMethod.POST)
    public String addVisit(@ModelAttribute("visit") Visit visit) {

        System.out.println(visit.getDoctor() + " " + visit.getDate());

        return "redirect:visit";
    }

}

