export interface Iuser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    mobile: string;
    password: string;
    __v: number;
    isblocked: boolean;
    profile: {
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
            skills: [string];
            _id: string;
        }];
        Experience?: [{
            _id: string;
            title: string;
            employmentType: string;
            company: string;
            startDate: Date;
            endDate: Date;
            location: string;
            description: string;
        }];
        Projects?: [{
            title?: string;
            description?: string;
            startDate?: Date | null;
            endDate?: Date | null;
            url?: string;
            skills?: string[];
        }];
    };
    Network: {
        connections: [{
            userId: string;  // Changed from Types.ObjectId to string for frontend
            connectedAt: Date;
        }];
        pendingRequestsSent: [{
            userId: string;  // Changed from Types.ObjectId to string for frontend
            sentAt: Date;
        }];
        pendingRequestsReceived: [{
            userId: string;  // Changed from Types.ObjectId to string for frontend
            sentAt: Date;
        }];
    };
    subscription?: {
        planType: 'Professional' | 'Recruiter Pro' | null;
        billingCycle: 'monthly' | 'yearly' | null;
        startDate?: Date | null;
        endDate?: Date | null;
        isActive: boolean;
        paymentHistory?: {
            transactionId: string;
            amount: number;
            date: Date;
            billingCycle: 'monthly' | 'yearly';
            planType: 'Professional' | 'Recruiter Pro';
        }[];
    };
}