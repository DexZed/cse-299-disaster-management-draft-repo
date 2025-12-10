import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentController {
    private readonly assignmentService;
    constructor(assignmentService: AssignmentService);
    create(createAssignmentDto: CreateAssignmentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): string;
    remove(id: string): string;
}
