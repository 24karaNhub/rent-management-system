package com.karan.rentmangement.service;
import com.karan.rentmangement.DTO.ResponseDTO.LandlordResponseDTO;
import org.springframework.stereotype.Service;

import com.karan.rentmangement.DTO.RequestDTO.PropertyRequestDTO;
import com.karan.rentmangement.DTO.RequestDTO.RoomRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.PropertyResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RentPaymentResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.RoomResponseDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Room;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.*;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {

    private final TenantRepo tenantRepo;
    private final PropertyRepo propertyRepo;
    private final rentPaymentRepo rentpaymentRepo;
    private final LandlordRepo landlordRepo;
    private final RoomRepo roomRepo;

    public PropertyService(PropertyRepo propertyRepo, TenantRepo tenantRepo,
                           rentPaymentRepo rentpaymentRepo, LandlordRepo landlordRepo,
                           RoomRepo roomRepo) {
        this.propertyRepo = propertyRepo;
        this.tenantRepo = tenantRepo;
        this.rentpaymentRepo = rentpaymentRepo;
        this.landlordRepo = landlordRepo;
        this.roomRepo = roomRepo;
    }

    private RoomResponseDTO toRoomResponseDTO(Room room) {
        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setRent(room.getRent());
        dto.setStatus(room.getStatus());
        if (room.getTenant() != null) {
            dto.setTenantId(room.getTenant().getid());
            dto.setTenantName(room.getTenant().getName());
        }
        return dto;
    }

    private Property toEntity(PropertyRequestDTO dto) {
        Property property = new Property();
        property.setName(dto.getName());
        property.setTotalRooms(dto.getTotalRooms());
        property.setType(dto.getType());
        property.setRent(dto.getRent());
        property.setCity(dto.getCity());
        property.setAddress(dto.getAddress());

        Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        property.setLandlord(landlord);
        return property;
    }

    private PropertyResponseDTO toResponseDTO(Property property) {
        PropertyResponseDTO dto = new PropertyResponseDTO();
        dto.setId(property.getId());
        dto.setName(property.getName());
        dto.setType(property.getType());
        dto.setRent(property.getRent());
        dto.setCity(property.getCity());
        dto.setAddress(property.getAddress());
        dto.setTotalRooms(property.getTotalRooms());

        if (property.getLandlord() != null) {
            dto.setLandlordName(property.getLandlord().getName());
        }

        List<Room> rooms = roomRepo.findByProperty(property);
        List<RoomResponseDTO> roomDTOs = new ArrayList<>();

        if (rooms.isEmpty()) {
            // Backward compatibility: create a virtual room for legacy properties
            RoomResponseDTO virtualRoom = new RoomResponseDTO();
            virtualRoom.setId(-1);
            virtualRoom.setRoomNumber("1");
            virtualRoom.setRent(property.getRent());
            List<Tenant> tenants = tenantRepo.findByProperty(property);
            virtualRoom.setStatus(tenants.isEmpty() ? "VACANT" : "OCCUPIED");
            if (!tenants.isEmpty()) {
                virtualRoom.setTenantId(tenants.get(0).getid());
                virtualRoom.setTenantName(tenants.get(0).getName());
            }
            roomDTOs.add(virtualRoom);
            dto.setTotalRooms(1);
        } else {
            for (Room room : rooms) {
                roomDTOs.add(toRoomResponseDTO(room));
            }
            dto.setTotalRooms(rooms.size());
        }

        dto.setRooms(roomDTOs);
        dto.setTennatCount((int) roomDTOs.stream().filter(r -> "OCCUPIED".equals(r.getStatus())).count());
        return dto;
    }

    private TenantResponseDTO toTenantDTO(Tenant tenant) {
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
        return dto;
    }

    private RentPaymentResponseDTO toPaymentDTO(rentPayment payment) {
        RentPaymentResponseDTO dto = new RentPaymentResponseDTO();
        dto.setId(payment.getId());

        if (payment.getRent() != null) dto.setAmount(payment.getRent());
        if (payment.getDate() != null) dto.setDate(payment.getDate().toString());
        if (payment.getMonth() != null) dto.setMonth(payment.getMonth().toString());

        dto.setStatus(payment.getStatus());

        if (payment.getLandlord() != null) {
            dto.setLandlordName(payment.getLandlord().getName());
        }
        return dto;
    }

    private LandlordResponseDTO toLandlordDTO(Landlord landlord) {
        LandlordResponseDTO dto = new LandlordResponseDTO();
        dto.setId(landlord.getId());
        dto.setName(landlord.getName());
        dto.setEmail(landlord.getEmail());
        dto.setPhone(landlord.getPhone());
        return dto;
    }

    public PropertyResponseDTO createProperty(PropertyRequestDTO dto) {
        Property property = toEntity(dto);
        Property saved = propertyRepo.save(property);

        // Create rooms if provided
        if (dto.getRooms() != null && !dto.getRooms().isEmpty()) {
            for (RoomRequestDTO roomDto : dto.getRooms()) {
                Room room = new Room();
                room.setRoomNumber(roomDto.getRoomNumber());
                room.setRent(roomDto.getRent() != null ? roomDto.getRent() : dto.getRent());
                room.setStatus(roomDto.getStatus() != null ? roomDto.getStatus() : "VACANT");
                room.setProperty(saved);
                roomRepo.save(room);
            }
            saved.setTotalRooms(dto.getRooms().size());
            propertyRepo.save(saved);
        }

        return toResponseDTO(saved);
    }

    public List<PropertyResponseDTO> getAll() {
        return propertyRepo.findAll().stream().map(this::toResponseDTO).toList();
    }

    public PropertyResponseDTO getById(int id) {
        Property property = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return toResponseDTO(property);
    }

    public PropertyResponseDTO update(int id, PropertyRequestDTO dto) {
        Property existing = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setRent(dto.getRent());
        existing.setCity(dto.getCity());
        existing.setAddress(dto.getAddress());

        Landlord landlord = landlordRepo.findById(dto.getLandlord_id())
                .orElseThrow(() -> new RuntimeException("Landlord not found"));
        existing.setLandlord(landlord);

        return toResponseDTO(propertyRepo.save(existing));
    }

    public String deleteProperty(int id) {
        Property existing = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        propertyRepo.delete(existing);
        return "Property deleted successfully";
    }

    public List<TenantResponseDTO> getTenantsOfProperty(int id) {
        Property property = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return tenantRepo.findByProperty(property).stream().map(this::toTenantDTO).toList();
    }

    public List<RentPaymentResponseDTO> getPaymentsOfProperty(int id) {
        Property property = propertyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return rentpaymentRepo.findByProperty(property).stream().map(this::toPaymentDTO).toList();
    }

    public List<PropertyResponseDTO> getPropertiesByLandlord(int landlordId) {
        return propertyRepo.findByLandlordId(landlordId).stream().map(this::toResponseDTO).toList();
    }

    public List<RoomResponseDTO> getRoomsOfProperty(int propertyId) {
        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return roomRepo.findByProperty(property).stream().map(this::toRoomResponseDTO).toList();
    }
}
