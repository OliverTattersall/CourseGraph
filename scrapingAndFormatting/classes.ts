export class Course {
    code: string;
    faculty?: string;
    classNumber?: number;
    name: string;
    prereqsRaw?: string;
    prereqs?: string;
    antireqs?: string;
    antireqsRaw?: string;
    ratings?: number;
    useful?: number;
    easy?: number;
    updatedAt?: Date;
}

