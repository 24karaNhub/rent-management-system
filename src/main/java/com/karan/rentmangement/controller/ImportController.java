package com.karan.rentmangement.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.karan.rentmangement.service.ImportService;
@RestController
@RequestMapping("/import")
public class ImportController {

    @Autowired
    private ImportService importService;

    @PostMapping("/excel")
    public ResponseEntity<String> uploadExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("landlordId") Integer landlordId) {
        return ResponseEntity.ok(
            importService.importFromExcel(file, landlordId)
        );
    }
}