import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
export declare class IncidentController {
    private readonly incidentService;
    constructor(incidentService: IncidentService);
    create(createIncidentDto: CreateIncidentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateIncidentDto: UpdateIncidentDto): string;
    remove(id: string): string;
}
