package com.karan.rentmangement.service;

import java.util.List;
import java.util.stream.Collectors;

import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import org.springframework.stereotype.Service;

import com.karan.rentmangement.DTO.RequestDTO.TenantRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Room;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.RoomRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;

@Service
public class TenantService {
    private final LandlordRepo landlordRepo;
    private final TenantRepo tenantRepo;
    private final PropertyRepo propertyRepo;
    private final rentPaymentRepo rentpaymentRepo;
    private final RoomRepo roomRepo;

    public TenantService(TenantRepo tenantRepo, LandlordRepo landlordRepo,
                         PropertyRepo propertyRepo, rentPaymentRepo rentpaymentRepo,
                         RoomRepo roomRepo) {
        this.tenantRepo = tenantRepo;
        this.landlordRepo = landlordRepo;
        this.propertyRepo = propertyRepo;
        this.rentpaymentRepo = rentpaymentRepo;
        this.roomRepo = roomRepo;
    }

    private TenantResponseDTO tResponseDTO(Tenant tenant) {
        TenantResponseDTO dto = new TenantResponseDTO();
        dto.setId(tenant.getid());
        dto.setName(tenant.getName());
        dto.setEmail(tenant.getEmail());
        dto.setPhone(tenant.getPhone());
        dto.setRent(tenant.getRent());
        dto.setStatus(tenant.getStatus());

        if (tenant.getLandlord() != null) {
            dto.setLandlordName(tenant.getLandlord().getName());
        }

        if (tenant.getProperty() != null) {
            dto.setPropertyAddress(tenant.getProperty().getAddress());
            dto.setProperty_id(tenant.getProperty().getId());
        }

        if (tenant.getRoom() != null) {
            dto.setRoomId(tenant.getRoom().getId());
            dto.setRoomNumber(tenant.getRoom().getRoomNumber());
        }

        dto.setDueDate(tenant.getDueDate());

        return dto;
    }

    public RentPaymentResponseDTO toPaymentDTO(rentPayment payment) {
        RentPaymentResponseDTO dto = new RentPaymentResponseDTO();
        dto.setId(payment.getId());
        if (payment.getRent() != null) dto.setAmount(payment.getRent());
        if (payment.getMonth() != null) dto.setMonth(payment.getMonth().toString());
        if (payment.getDate() != null) dto.setDate(payment.getDate().toString());
        dto.setStatus(payment.getStatus());
        if (payment.getProperty() != null) {
            dto.setPropertyId(payment.getProperty().getId());
        }
        if (payment.getTenant() != null) {
            dto.setTenantId(payment.getTenant().getid());
            dto.setTenantName(payment.getTenant().getName());
        }
        return dto;
    }

    public LandlordResponseDTO toLandlordDTO(Landlord landlord) {
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
    }

    public TenantResponseDTO createTenant(TenantRequestDTO dto) {
        Tenant tenant = new Tenant();
        tenant.setName(dto.getName());
        tenant.setEmail(dto.getEmail());
        tenant.setPhone(dto.getPhone());
        tenant.setRent(dto.getRent());
        tenant.setMoveInDate(dto.getMoveInDate());
        tenant.setMoveOutDate(dto.getMoveOutDate());
        if (dto.getDueDate() == null) {
            throw new IllegalArgumentException("Rent due date is required");
        }
        if (dto.getMoveInDate() != null && dto.getDueDate().isBefore(dto.getMoveInDate())) {
            throw new IllegalArgumentException("Rent due date cannot be before move-in date");
        }
        tenant.setDueDate(dto.getDueDate());
        tenant.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        tenant.setLandlord(landlord);

        Property property = propertyRepo.findById(dto.getProperty_id())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        tenant.setProperty(property);

        // Handle room assignment
        if (dto.getRoomId() != null && dto.getRoomId() > 0) {
            Room room = roomRepo.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            tenant.setRoom(room);
            room.setStatus("OCCUPIED");
            room.setTenant(tenant);
            // Use room rent if tenant rent not explicitly set
            if (dto.getRent() == 0 && room.getRent() != null) {
                tenant.setRent(room.getRent());
            }
        }

        Tenant savedTenant = tenantRepo.save(tenant);

        // Update room with the saved tenant
        if (savedTenant.getRoom() != null) {
            Room room = savedTenant.getRoom();
            room.setTenant(savedTenant);
            roomRepo.save(room);
        }

        return tResponseDTO(savedTenant);
    }

    public List<TenantResponseDTO> getAllTenants() {
        return tenantRepo.findAll().stream().map(this::tResponseDTO).collect(Collectors.toList());
    }

    public TenantResponseDTO getById(int id) {
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not Found"));
        return tResponseDTO(tenant);
    }

    public TenantResponseDTO updateTenant(int id, TenantRequestDTO dto) {
        Tenant existing = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setRent(dto.getRent());
        if (dto.getDueDate() == null) {
            throw new IllegalArgumentException("Rent due date is required");
        }
        if (dto.getMoveInDate() != null && dto.getDueDate().isBefore(dto.getMoveInDate())) {
            throw new IllegalArgumentException("Rent due date cannot be before move-in date");
        }
        existing.setDueDate(dto.getDueDate());

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        existing.setLandlord(landlord);

        Property property = propertyRepo.findById(dto.getProperty_id())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        existing.setProperty(property);

        // Handle room change
        if (dto.getRoomId() != null && dto.getRoomId() > 0) {
            // Release old room if any
            if (existing.getRoom() != null && existing.getRoom().getId() != dto.getRoomId()) {
                Room oldRoom = existing.getRoom();
                oldRoom.setStatus("VACANT");
                oldRoom.setTenant(null);
                roomRepo.save(oldRoom);
            }
            // Assign new room
            Room newRoom = roomRepo.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            existing.setRoom(newRoom);
            newRoom.setStatus("OCCUPIED");
            newRoom.setTenant(existing);
            roomRepo.save(newRoom);
        }

        Tenant updated = tenantRepo.save(existing);
        return tResponseDTO(updated);
    }

    public TenantResponseDTO updateStatus(int id, String status) {
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        tenant.setStatus(status);

        // If deactivating, release the room
        if ("INACTIVE".equalsIgnoreCase(status) && tenant.getRoom() != null) {
            Room room = tenant.getRoom();
            room.setStatus("VACANT");
            room.setTenant(null);
            roomRepo.save(room);
            tenant.setRoom(null);
        }

        Tenant updated = tenantRepo.save(tenant);
        return tResponseDTO(updated);
    }

    public String deleteTenant(int id) {
        Tenant existing = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // Release room on delete
        if (existing.getRoom() != null) {
            Room room = existing.getRoom();
            room.setStatus("VACANT");
            room.setTenant(null);
            roomRepo.save(room);
        }

        tenantRepo.delete(existing);
        return "Tenant deleted successfully";
    }

    public LandlordResponseDTO getTenantLandlord(int id) {
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Landlord landlord = tenant.getLandlord();
        if (landlord == null) {
            throw new RuntimeException("No landlord assigned to this tenant");
        }

        return toLandlordDTO(landlord);
    }

    public List<TenantResponseDTO> getTenantsByLandlord(int landlordId) {
        return tenantRepo.findByLandlordId(landlordId).stream()
                .map(this::tResponseDTO)
                .toList();
    }

    public List<RentPaymentResponseDTO> getPaymentsOfTenant(int id) {
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        List<rentPayment> payments = rentpaymentRepo.findByTenantOrderByDateDesc(tenant);
        return payments.stream().map(this::toPaymentDTO).collect(Collectors.toList());
    }
}
