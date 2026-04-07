package com.karan.rentmangement.service;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Month;

@Service
public class ImportService {

    @Autowired
    private LandlordRepo landlordRepo;

    @Autowired
    private PropertyRepo propertyRepo;

    @Autowired
    private TenantRepo tenantRepo;

    @Autowired
    private rentPaymentRepo rentpaymentRepo;

    public String importFromExcel(MultipartFile file, Integer landlordId) {
        Landlord landlord = landlordRepo.findById(landlordId)
                .orElseThrow(() -> new RuntimeException("Landlord not found with id: " + landlordId));

        int imported = 0;
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                // Skip header row
                if (row.getRowNum() == 0) continue;

                // Read each column
                String tenantName = row.getCell(0).getStringCellValue();
                String phone = row.getCell(1).getStringCellValue();
                String address = row.getCell(2).getStringCellValue();
                Long rent = (long) row.getCell(3).getNumericCellValue();
                String month = row.getCell(4).getStringCellValue();
                String status = row.getCell(5).getStringCellValue();

                // Create Property
                Property property = new Property();
                property.setAddress(address);
                property.setLandlord(landlord);
                propertyRepo.save(property);

                // Create Tenant
                Tenant tenant = new Tenant();
                tenant.setName(tenantName);
                tenant.setPhone(phone);
                tenant.setRent(rent);
                tenant.setProperty(property);
                tenant.setLandlord(landlord);
                tenantRepo.save(tenant);

                // Create Payment
                rentPayment payment = new rentPayment();
                payment.setRent(rent);
                payment.setMonth(Month.valueOf(month.toUpperCase()));
                payment.setStatus(status);
                payment.setTenant(tenant);
                payment.setProperty(property);
                payment.setLandlord(landlord);
                rentpaymentRepo.save(payment);

                imported++;
            }
            return imported + " records imported successfully!";
        } catch (IOException e) {
            throw new RuntimeException("Failed to import excel file: " + e.getMessage());
        }
    }
}