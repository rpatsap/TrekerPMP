package com.example.univer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/")
public class TestResource {

    private List<Charge> data = new CopyOnWriteArrayList<>();

    @GetMapping
    public ResponseEntity<List<Charge>> hello() {
        return new ResponseEntity<>(data, OK);
    }

    @PostMapping
    public ResponseEntity<Charge> post(@RequestBody Charge charge) {
        data.add(charge);
        return new ResponseEntity<>(charge, OK);
    }

}
