export type IReviewItem = {
    id?: string;
    customer: {
        email: string;
        name: string;
        avatar: string;
    };
    rating: string;
    descriptions: string;
    created_at: string;
};