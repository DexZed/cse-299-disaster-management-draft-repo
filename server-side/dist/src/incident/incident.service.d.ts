import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
export declare class IncidentService {
    create(createIncidentDto: CreateIncidentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateIncidentDto: UpdateIncidentDto): string;
    remove(id: number): string;
}
