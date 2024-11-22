export interface Iuser {
    _id:string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    mobile: string;
    password: string;
    __v: number;
    isblocked: boolean;
    profile:{
        profilePicture?: string;
        bannerImage?: string;
        about?: string;
        headline?: string;
        location?: string;
        company?: string;
        website?: string;
        connections?: number;
        Education?: [{
            school: string;
            degree: string;
            startDate: Date;
            endDate: Date;
            skills:[string];
            _id:string
        }]
        Experience?:[{
            title: string,
            employmentType: string,
            company: string,
            startDate: Date,
            endDate: Date,
            location: string,
            description: string,
        }]
        Projects?:[{
            title?: string;
            description?: string;
            startDate?: Date | null;
            endDate?: Date | null;
            url?: string;
            skills?: string[];
        }]

    }
}
  